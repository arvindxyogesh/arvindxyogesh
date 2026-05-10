"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050816, 8, 20);

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.4, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xf59e0b, 2.2);
    key.position.set(3, 2, 5);
    scene.add(key);

    const accent = new THREE.PointLight(0x38bdf8, 2.5, 20);
    accent.position.set(-4, -1, 4);
    scene.add(accent);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.3, 0.38, 180, 20),
      new THREE.MeshStandardMaterial({
        color: 0xdbeafe,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x0f172a,
      }),
    );
    scene.add(knot);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 260;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 12;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.025,
        transparent: true,
        opacity: 0.9,
      }),
    );
    scene.add(particles);

    let frame = 0;
    let requestId = 0;

    const animate = () => {
      frame += 0.008;
      knot.rotation.x = frame * 0.8;
      knot.rotation.y = frame * 1.2;
      knot.position.y = Math.sin(frame * 2) * 0.15;
      particles.rotation.y = frame * 0.18;
      renderer.render(scene, camera);
      requestId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const nextWidth = mount.clientWidth;
      const nextHeight = mount.clientHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener("resize", handleResize);
    requestId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(requestId);
      window.removeEventListener("resize", handleResize);
      particlesGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      knot.geometry.dispose();
      (knot.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}
