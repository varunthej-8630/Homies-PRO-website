/* eslint-disable @react-three/no-new-in-loop */
import { Camera, Scene, Texture } from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useRef } from 'react';

import Effect from '@src/components/canvas/fluid/effect/Fluid';
import useFBOs from '@src/components/canvas/fluid/hooks/useFBOs';
import useMaterials from '@src/components/canvas/fluid/hooks/useMaterials';
import useOpts from '@src/components/canvas/fluid/hooks/useOpts';
import usePointerEvents from '@src/components/canvas/fluid/hooks/usePointerEvents';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Fluid({ mainRef, fluidColor }) {
  const [isMenuOpen] = useStore(useShallow((state) => [state.isMenuOpen]));
  const OPTS = useOpts();
  const { force, radius, curl, swirl, intensity, backgroundColor, showBackground, pressure, densityDissipation, velocityDissipation } = OPTS;
  const size = useThree((three) => three.size);
  const gl = useThree((three) => three.gl);

  const bufferScene = useRef(new Scene());
  const bufferCamera = useRef(new Camera());
  const meshRef = useRef(null);
  const postRef = useRef(null);
  const FBOs = useFBOs();
  const materials = useMaterials();
  const splatStack = usePointerEvents(mainRef, size, force);

  const setShaderMaterial = useCallback(
    (name) => {
      if (!meshRef.current) return;
      meshRef.current.material = materials[name];
    },
    [materials],
  );

  const setRenderTarget = useCallback(
    (name) => {
      const target = FBOs[name];
      if ('write' in target) {
        gl.setRenderTarget(target.write);
        gl.clear();
        gl.render(bufferScene.current, bufferCamera.current);
        target.swap();
      } else {
        gl.setRenderTarget(target);
        gl.clear();
        gl.render(bufferScene.current, bufferCamera.current);
      }
    },
    [bufferCamera, bufferScene, FBOs, gl],
  );

  const setUniforms = useCallback(
    (material, uniform, value) => {
      const mat = materials[material];
      if (mat && mat.uniforms[uniform]) {
        mat.uniforms[uniform].value = value;
      }
    },
    [materials],
  );

  const setUniformVector2 = useCallback(
    (material, uniform, x, y) => {
      const mat = materials[material];
      if (mat && mat.uniforms[uniform]) {
        mat.uniforms[uniform].value.set(x, y);
      }
    },
    [materials],
  );

  const setUniformVector3 = useCallback(
    (material, uniform, x, y, z) => {
      const mat = materials[material];
      if (mat && mat.uniforms[uniform]) {
        mat.uniforms[uniform].value.set(x, y, z);
      }
    },
    [materials],
  );

  const activeFrames = useRef(0);

  useFrame(() => {
    if (!meshRef.current || !postRef.current || isMenuOpen) return;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (splatStack.current.length > 0) {
      activeFrames.current = 45; // Run simulation for 45 frames to let fluid dissipate
      while (splatStack.current.length > 0) {
        const { mouseX, mouseY, velocityX, velocityY } = splatStack.current.pop();

        setShaderMaterial('splat');
        setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
        setUniformVector2('splat', 'uPointer', mouseX, mouseY);
        setUniformVector3('splat', 'uColor', velocityX, velocityY, 10.0);
        setUniforms('splat', 'uRadius', radius / 100.0);
        setRenderTarget('velocity');
        setUniforms('splat', 'uTarget', FBOs.density.read.texture);
        setRenderTarget('density');
      }
    } else if (activeFrames.current > 0) {
      activeFrames.current -= 1;
    } else {
      // Idle and dissipated: skip all 10 GPU passes
      return;
    }

    // Skip heavy multi-pass simulation during active smooth scrolling
    if (typeof window !== 'undefined' && window.lenis?.isScrolling) {
      return;
    }

    const shaderUpdates = [
      {
        material: 'curl',
        uniforms: { uVelocity: FBOs.velocity.read.texture },
        target: 'curl',
      },
      {
        material: 'vorticity',
        uniforms: {
          uVelocity: FBOs.velocity.read.texture,
          uCurl: FBOs.curl.texture,
          uCurlValue: curl,
        },
        target: 'velocity',
      },
      {
        material: 'divergence',
        uniforms: { uVelocity: FBOs.velocity.read.texture },
        target: 'divergence',
      },
      {
        material: 'clear',
        uniforms: {
          uTexture: FBOs.pressure.read.texture,
          uClearValue: pressure,
        },
        target: 'pressure',
      },
    ];

    shaderUpdates.forEach(({ material, uniforms, target }) => {
      setShaderMaterial(material);
      Object.entries(uniforms).forEach(([key, value]) => setUniforms(material, key, value));
      setRenderTarget(target);
    });

    setShaderMaterial('pressure');
    setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);
    for (let i = 0; i < swirl; i += 1) {
      setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
      setRenderTarget('pressure');
    }

    setShaderMaterial('gradientSubstract');
    setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
    setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
    setRenderTarget('velocity');

    setShaderMaterial('advection');
    setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
    setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
    setUniforms('advection', 'uDissipation', velocityDissipation);
    setRenderTarget('velocity');

    setUniforms('advection', 'uSource', FBOs.density.read.texture);
    setUniforms('advection', 'uDissipation', densityDissipation);
    setRenderTarget('density');

    gl.setRenderTarget(null);
    gl.clear();
  }, 0);

  return (
    <>
      {createPortal(
        <mesh ref={meshRef} scale={[1, 1, 0]}>
          <planeGeometry args={[2, 2, 1, 1]} />
        </mesh>,
        bufferScene.current,
      )}
      <Effect
        intensity={intensity * 0.0001}
        backgroundColor={backgroundColor}
        fluidColor={fluidColor}
        showBackground={showBackground}
        ref={postRef}
        tFluid={FBOs?.density?.read?.texture || new Texture()}
      />
    </>
  );
}
export default Fluid;
