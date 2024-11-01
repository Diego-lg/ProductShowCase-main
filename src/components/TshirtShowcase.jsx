import React, {
  memo,
  Suspense,
  useMemo,
  useEffect, useRef,
} from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import {
  TextureLoader,
  MeshStandardMaterial,
  BackSide,
  ClampToEdgeWrapping, BoxGeometry, Float32BufferAttribute, PointsMaterial
} from "three";
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
  useGLTF,
  useTexture,
  Decal,
  Reflector,
} from "@react-three/drei";
import DynamicFerrofluid from "./LoadingFerrofluid";
import { LineSegments } from "three";
import { Edges } from "@react-three/drei";


const Scene = ({ fullTextureUrl, loading, sliderValue }) => {
  const textures = useLoader(TextureLoader, [
    "tshirt/fabric_167_ambientocclusion-4K.png",
    "tshirt/fabric_167_basecolor-4K.png",
    "tshirt/fabric_167_normal-4K.png",
    "tshirt/fabric_167_roughness-4K.png",
  ]);

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

  useEffect(() => {
    if (fullTexture) {
      fullTexture.wrapS = ClampToEdgeWrapping;
      fullTexture.wrapT = ClampToEdgeWrapping;
      fullTexture.needsUpdate = true;
    }
  }, [fullTexture]);
  // Custom animated wireframe cube component
  const AnimatedWireframeCube = () => {
    const meshRef = useRef();

    useFrame(({ clock }) => {
      const time = clock.getElapsedTime();
      const scale = 15; // Adjust scale as needed
      const positionOffset = Math.sin(time * 2) * 0.5; // Adjust speed and amplitude of the wave

      // Update the scale or position to create the fluid effect
      meshRef.current.scale.set(scale + positionOffset, scale + positionOffset, scale + positionOffset);
    });

    return (
      <mesh ref={meshRef} scale={[15, 15, 15]} position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="cyan" wireframe opacity={0.4} transparent />
        <Edges threshold={15} color="cyan" />
      </mesh>
    );
  };
  return (
    <>


      {loading ? (
        <DynamicFerrofluid />
      ) : (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.T_Shirt_male.geometry}
          material={material}
          scale={[13, 13, 13]}
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
          />
        </mesh>

      )}
      {/* Wireframe Cube surrounding the model */}
      <AnimatedWireframeCube />

      {/* <ContactShadows
        position={[0, -1.6, 0]}
        scale={10}
        blur={1.5}
        opacity={0.7}
        far={5}
      /> */}
    </>
  );
};


const TshirtShowcase = ({ imageUrl, loading, sliderValue }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const imageurl_shopify =
    imageUrl || queryParams.get("image") || "xamples/007.png";

  return (
    <Canvas
      gl={{
        physicallyCorrectLights: true,
        toneMappingExposure: 1.5,
        antialias: true,
        alpha: false,
      }}
    >
      <Suspense fallback={null}>
        {/* <Environment preset="forest"
          background={true}

        /> */}


        <Scene

          fullTextureUrl={imageurl_shopify}
          loading={loading}
          sliderValue={sliderValue}
        />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
    </Canvas>
  );
};

export default memo(TshirtShowcase);
