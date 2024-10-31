import React, {
  memo,
  Suspense,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import {
  TextureLoader,
  MeshStandardMaterial,
  BackSide,
  Vector3,
  ClampToEdgeWrapping,
  RepeatWrapping,
} from "three";
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
  useGLTF,
  useTexture,
  Billboard,
  Decal,
} from "@react-three/drei";
import { EffectComposer, SSR, Bloom, LUT } from "@react-three/postprocessing";
import { LUTCubeLoader } from "postprocessing";
import { LayerMaterial, Depth } from "lamina";
import DynamicFerrofluid from "./LoadingFerrofluid";

const Glow = ({ color = "#ff0000", scale = 0.5, near = -2, far = 1.4 }) => (
  <Billboard>
    <mesh>
      <LayerMaterial transparent depthWrite={false}>
        <Depth
          colorA={color}
          colorB="red"
          alpha={1}
          mode="normal"
          near={near * scale}
          far={far * scale}
          origin={[0, 0, 0]}
        />
      </LayerMaterial>
    </mesh>
  </Billboard>
);

const Scene = ({ fullTextureUrl, loading, sliderValue }) => {
  const textures = useLoader(TextureLoader, [
    "tshirt/fabric_167_ambientocclusion-4K.png",
    "tshirt/fabric_167_basecolor-4K.png",
    "tshirt/fabric_167_normal-4K.png",
    "tshirt/fabric_167_roughness-4K.png",
  ]);
  console.log(sliderValue);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        map: textures[1],
        aoMap: textures[0],
        normalMap: textures[2],
        roughnessMap: textures[3],
        roughness: 0.7,
        metalness: 0.3,
        color: "white",
        side: BackSide,
      }),
    [textures]
  );

  const material_2 = useMemo(
    () =>
      new MeshStandardMaterial({
        map: textures[1],
        aoMap: textures[0],
        normalMap: textures[2],
        roughnessMap: textures[3],
        roughness: 0.5,
        metalness: 0.7,
      }),
    [textures]
  );

  const fullTexture = useTexture(fullTextureUrl);
  const { nodes } = useGLTF("tshirt.glb");
  const { camera } = useThree();

  useEffect(() => {
    const updateCameraPosition = () => {
      if (window.innerWidth < 768) {
        camera.position.set(0, 15, 8);
      } else {
        camera.position.set(0, 8, 5);
      }
      camera.lookAt(0, 0, 0);
    };

    updateCameraPosition();
    window.addEventListener("resize", updateCameraPosition);

    return () => {
      window.removeEventListener("resize", updateCameraPosition);
    };
  }, [camera]);

  // New useEffect to prevent texture repetition
  useEffect(() => {
    if (fullTexture) {
      fullTexture.wrapS = ClampToEdgeWrapping;
      fullTexture.wrapT = ClampToEdgeWrapping;
      fullTexture.needsUpdate = true;
    }
  }, [fullTexture]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} castShadow />
      <directionalLight position={[-5, 10, -5]} intensity={0.4} castShadow />

      <Environment resolution={512}>
        {[...Array(7)].map((_, i) => (
          <Lightformer
            key={i}
            intensity={2.5}
            rotation-x={Math.PI / 2}
            position={[0, 4, -9 + i * 3]}
            scale={[10, 1, 1]}
          />
        ))}
        <Lightformer
          intensity={2.5}
          rotation-y={Math.PI / 2}
          position={[-50, 2, 0]}
          scale={[100, 2, 1]}
        />
        <Lightformer
          intensity={2.5}
          rotation-y={-Math.PI / 2}
          position={[50, 2, 0]}
          scale={[100, 2, 1]}
        />
        <Lightformer
          form="ring"
          color="white"
          intensity={12}
          scale={2.5}
          position={[10, 5, 10]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>

      {loading ? (
        <DynamicFerrofluid />
      ) : (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.T_Shirt_male.geometry}
          material={material}
          material-roughness={0.5}
          material-metalness={0.1}
          dispose={null}
          scale={[7, 7, 7]}
          position={[0, 0.5, 0]}
        >
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 5 - sliderValue / 10, 0]}
            scale={0.7}
            map={fullTexture}
            material={material_2}
            depthTest={true}
            depthWrite={true}
            material-opacity={1}
            material-roughness={0.9}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      )}
    </>
  );
};

const Effects = () => {
  const texture = useLoader(LUTCubeLoader, "/F-6800-STD.cube");

  return (
    <EffectComposer>
      <LUT lut={texture} />
    </EffectComposer>
  );
};

const TshirtShowcase = ({ imageUrl, loading, sliderValue }) => {
  // Get the image URL from query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const imageurl_shopify =
    imageUrl || queryParams.get("image") || "xamples/010.png"; // Fallback image

  return (
    <Canvas
      gl={{
        physicallyCorrectLights: true,
        toneMappingExposure: 1.5,
        antialias: true,
        alpha: false,
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 15], fov: 35 }}
    >
      <color attach="background" args={["black"]} />
      <Suspense fallback={null}>
        <Glow scale={1.2} near={-25} />
        <Scene
          fullTextureUrl={imageurl_shopify}
          loading={loading}
          sliderValue={sliderValue}
        />
        <Effects />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
};

export default memo(TshirtShowcase);
