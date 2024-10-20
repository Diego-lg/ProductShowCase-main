import React, {
  memo,
  Suspense,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader, MeshStandardMaterial, BackSide } from "three";
import {
  Billboard,
  Decal,
  Environment,
  OrbitControls,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { LayerMaterial, Depth } from "lamina";

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

const ScreenshotButton = ({ captureScreenshot }) => (
  <button
    style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
    onClick={captureScreenshot}
  >
    Capture Screenshot
  </button>
);

const DownloadButton = ({ screenshot, downloadImage }) => (
  <button
    style={{ position: "absolute", top: "10px", left: "120px", zIndex: 1 }}
    onClick={() => downloadImage(screenshot)}
  >
    Download Screenshot
  </button>
);

const DisplayScreenshot = ({ screenshot, downloadImage }) => (
  <>
    <img
      src={screenshot}
      alt="Screenshot"
      style={{
        position: "absolute",
        top: "50px",
        left: "10px",
        zIndex: 1,
        width: "256px",
        height: "256px",
      }}
    />
    <DownloadButton screenshot={screenshot} downloadImage={downloadImage} />
  </>
);

const Scene = ({ triggerScreenshot, setScreenshot }) => {
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
        roughness: 0.5,
        color: "black",
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
        metalness: 0.5,
      }),
    [textures]
  );

  const fullTexture = useTexture("xamples/014.png");
  const { nodes } = useGLTF("tshirt.glb");

  const { gl, scene, camera } = useThree();

  // Setup the triggerScreenshot function
  useEffect(() => {
    if (triggerScreenshot) {
      triggerScreenshot.current = () => {
        gl.render(scene, camera);
        const screenshot = gl.domElement.toDataURL("image/png");
        setScreenshot(screenshot);
      };
    }
  }, [gl, scene, camera, triggerScreenshot, setScreenshot]);

  return (
    <>
      <OrbitControls
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.7}
        minDistance={4}
        maxDistance={8}
      />
      <ambientLight intensity={1.5} />
      <Environment
        background
        files={["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]}
        path="/background/"
      />
      <directionalLight
        position={[0, 10, 1]}
        intensity={5.5}
        color="white"
        castShadow
      />
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={material}
        material-roughness={0.4}
        material-opacity={1}
        dispose={null}
        scale={[10, 10, 10]}
        position={[0, 0, 0]}
      >
        <Decal
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
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
    </>
  );
};

const TshirtShowcase = () => {
  const [screenshot, setScreenshot] = useState(null);
  const triggerScreenshot = useRef(() => {});

  const downloadImage = (imgData) => {
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Canvas>
      <Suspense fallback={null}>
        <Glow scale={1.2} near={-25} />
        <Scene
          triggerScreenshot={triggerScreenshot}
          setScreenshot={setScreenshot}
        />
      </Suspense>
    </Canvas>
  );
};

export default memo(TshirtShowcase);
