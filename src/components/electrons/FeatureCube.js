import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * FeatureCube - An enhanced 3D cube component with chrome effects that can display feature text on each face
 */
const FeatureCube = ({
  darkMode = false,
  showText = true,
  cubeColor,
  autoRotate = false,
  paddingY = 0,
  rotationSpeed = 0.005,
  spin = true,
  sectionData
}) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    cube: null,
    animationId: null,
    lights: [],
    envMap: null
  });
  
  // Determine cube color based on props or default to dark mode setting
  const determineCubeColor = () => {
    if (cubeColor) return cubeColor;
    return darkMode ? 0x222222 : 0xf0f0f0;
  };

  // Default section data if not provided
  const defaultSectionData = [
    {
      title: "Lightning fast SAAS platform",
      items: [
        'React 18 frontend + Go/Node API',
        'Proven MUI dashboard components',
        'Secure Web Sockets + Node.js',
        'HTTPS only driven portals and page parts'
      ]
    },
    {
      title: "Supercharged buyer listings",
      items: [
        'Automatic push + email notifications',
        'Stripe secure checkout sessions',
        'Stripe secure subscriptions',
        'Stripe 3D enabled checkouts'
      ]
    },
    {
      title: "Performant subscriber dashboard",
      items: [
        'User registration with subdomain, email',
        'User email activation with code',
        'Resend activation code if not received',
        'User password reset through email code'
      ]
    },
    {
      title: "100 monthly flat fee MLS buyers",
      items: [
        'Subscription creation and plan changes',
        'Add or remove credit cards',
        'Subscription cancel and re-enable',
        '3D Secure ready payments'
      ]
    },
    {
      title: "Push and email notifications",
      items: [
        'Stripe webhooks handling',
        'Event notifications: new subscriptions',
        'Daily notifications: expiring trials',
        'Account suspension alerts'
      ]
    },
    {
      title: "Teams management portal page",
      items: [
        "Account's user list (admins only)",
        'Create, update, and delete users',
        'Team management endpoints',
        'Complete authentication routes'
      ]
    }
  ];
  
  useEffect(() => {
    if (!containerRef.current || containerRef.current.querySelector('canvas')) {
      return;
    }

    const loadThreeJS = () => {
      return new Promise((resolve, reject) => {
        if (window.THREE) {
          resolve(window.THREE);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.min.js';
        script.async = true;
        script.onload = () => resolve(window.THREE);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      try {
        const THREE = await loadThreeJS();
        setIsLoading(false);
        
        containerRef.current.innerHTML = '';
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        // Scene setup
        const scene = new THREE.Scene();
        threeRef.current.scene = scene;
        
        // Adjust camera position to see more of the top/bottom
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 15; // Position even further back
        camera.position.y = 0;  // Reset to center height
        threeRef.current.camera = camera;
        
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
          precision: "highp"
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // Set transparent background
        renderer.setPixelRatio(window.devicePixelRatio); // For sharper rendering
        renderer.physicallyCorrectLights = true;
        containerRef.current.appendChild(renderer.domElement);
        threeRef.current.renderer = renderer;
        
        // Create environment map for reflections
        const createEnvMap = () => {
          const pmremGenerator = new THREE.PMREMGenerator(renderer);
          pmremGenerator.compileEquirectangularShader();
          
          // Create a simple gradient environment
          const cubeRenderTarget = pmremGenerator.fromScene(new THREE.Scene());
          const envMap = cubeRenderTarget.texture;
          
          threeRef.current.envMap = envMap;
          pmremGenerator.dispose();
          
          return envMap;
        };
        
        const envMap = createEnvMap();
        
        // Create cube with responsive sizing
        const getResponsiveDimensions = () => {
          // Get actual viewport width
          const viewportWidth = window.innerWidth;
          
          // Determine size based on breakpoints - much larger for non-mobile
          // xs: 0-600px, sm: 600-960px, md: 960-1280px, lg: 1280-1920px, xl: 1920+
          let cubeSize;
          
          if (viewportWidth < 600) {
            cubeSize = 5; // Base size for mobile (keeping the same)
          } else if (viewportWidth < 960) {
            cubeSize = 8; // Much larger for sm
          } else if (viewportWidth < 1280) {
            cubeSize = 10; // Even larger for md
          } else if (viewportWidth < 1920) {
            cubeSize = 12; // Very large for lg
          } else {
            cubeSize = 14; // Largest for xl
          }
          
          return cubeSize;
        };
        
        const cubeSize = getResponsiveDimensions();
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        
        // Create materials with enhanced chrome effects
        const faceColor = determineCubeColor();
        const materials = Array(6).fill().map(() => 
          new THREE.MeshPhysicalMaterial({
            color: faceColor,
            metalness: 0.9, // Increased from 0.6 for more metallic look
            roughness: 0.1, // Decreased from 0.2 for more polished appearance
            envMap: envMap,
            envMapIntensity: 1.0,
            clearcoat: 0.5, // Add clearcoat for extra shine
            clearcoatRoughness: 0.1,
            reflectivity: 1.0
          })
        );
        
        const cube = new THREE.Mesh(geometry, materials);
        // Position cube in center of scene
        cube.position.set(0, 0, 0);
        scene.add(cube);
        threeRef.current.cube = cube;

        // Add text if enabled
        if (showText) {
          // Add text to the cube faces
          const addTextToFaces = () => {
            // Load font from CDN
            const loader = new THREE.FontLoader();
            const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';
            
            loader.load(fontUrl, function(font) {
              // Create text for each of the 6 sides
              const sectionsToUse = sectionData || defaultSectionData;
              sectionsToUse.forEach((section, index) => {
                // Use all 6 sides of the cube
                const faces = [0, 1, 4, 5, 2, 3];
                const faceIndex = faces[index % faces.length]; // Handle if there are more than 6 sections
                
                // Title configuration - increased depth
                const titleOptions = {
                  font: font,
                  size: 0.25,
                  height: 0.12, // Increased from 0.05 for more depth
                  curveSegments: 16, // Increased from 12 for smoother curves
                  bevelEnabled: true, // Enable beveling
                  bevelThickness: 0.02,
                  bevelSize: 0.01,
                  bevelSegments: 8
                };
                
                // Item text configuration - increased depth
                const itemOptions = {
                  font: font,
                  size: 0.15,
                  height: 0.06, // Increased from 0.02 for more depth
                  curveSegments: 8, // Increased from 4 for smoother curves
                  bevelEnabled: true, // Enable beveling
                  bevelThickness: 0.01,
                  bevelSize: 0.005,
                  bevelSegments: 3
                };
                
                // Create title geometry
                const titleGeo = new THREE.TextGeometry(section.title, titleOptions);
                titleGeo.computeBoundingBox();
                
                // Center title horizontally
                const titleWidth = titleGeo.boundingBox.max.x - titleGeo.boundingBox.min.x;
                const titleCenterOffset = -titleWidth / 2;
                
                // Create title material (matching cube color with metallic finish)
                const textMaterialTitle = new THREE.MeshStandardMaterial({ 
                  color: faceColor,
                  metalness: 0.8,
                  roughness: 0.2,
                  envMap: envMap
                });
                
                // Create title mesh
                const titleMesh = new THREE.Mesh(titleGeo, textMaterialTitle);
                titleMesh.position.x = 0; // Center at origin
                
                // Create a group to hold all text for this face
                const faceGroup = new THREE.Group();
                
                // Center the title within the group
                titleMesh.position.x = titleCenterOffset;
                faceGroup.add(titleMesh);
                
                // Add items text below title with proper centering
                section.items.forEach((item, itemIndex) => {
                  const itemGeo = new THREE.TextGeometry(item, itemOptions);
                  itemGeo.computeBoundingBox();
                  
                  const itemWidth = itemGeo.boundingBox.max.x - itemGeo.boundingBox.min.x;
                  const itemCenterOffset = -itemWidth / 2;
                  
                  // Slightly different material for items
                  const textMaterialItem = new THREE.MeshStandardMaterial({ 
                    color: faceColor,
                    metalness: 0.6,
                    roughness: 0.3,
                    envMap: envMap
                  });
                  
                  const itemMesh = new THREE.Mesh(itemGeo, textMaterialItem);
                  // Position items below title with spacing
                  itemMesh.position.y = -0.7 - (itemIndex * 0.4); // More space below title
                  itemMesh.position.x = itemCenterOffset; // Center each item
                  
                  faceGroup.add(itemMesh);
                });
                
                // Position each face directly on its respective cube face
                cube.add(faceGroup);
                
                // Position the entire face group based on which cube face
                // Offset slightly from each face to prevent z-fighting
                const offset = 0.01;
                const faceOffset = cubeSize / 2 + offset;
                
                switch(faceIndex) {
                  case 0: // Front
                    faceGroup.position.z = faceOffset;
                    faceGroup.position.y = 1;
                    break;
                  case 1: // Back
                    faceGroup.position.z = -faceOffset;
                    faceGroup.position.y = 1;
                    faceGroup.rotation.y = Math.PI;
                    break;
                  case 4: // Left
                    faceGroup.position.x = -faceOffset;
                    faceGroup.position.y = 1;
                    faceGroup.rotation.y = -Math.PI / 2;
                    break;
                  case 5: // Right
                    faceGroup.position.x = faceOffset;
                    faceGroup.position.y = 1;
                    faceGroup.rotation.y = Math.PI / 2;
                    break;
                  case 2: // Top
                    faceGroup.position.y = faceOffset;
                    faceGroup.rotation.x = -Math.PI / 2;
                    break;
                  case 3: // Bottom
                    faceGroup.position.y = -faceOffset;
                    faceGroup.rotation.x = Math.PI / 2;
                    break;
                }
              });
            });
          };
          
          addTextToFaces();
        }
        
        // Enhanced lighting system
        // Store lights for animation
        threeRef.current.lights = [];
        
        // Base ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Reduced intensity
        scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 10);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        threeRef.current.lights.push(directionalLight);
        
        // Add multiple point lights for dramatic lighting
        const createPointLight = (color, intensity, position) => {
          const light = new THREE.PointLight(color, intensity, 50);
          light.position.set(...position);
          scene.add(light);
          threeRef.current.lights.push(light);
          return light;
        };
        
        // Create dramatic lighting with multiple colored lights
        createPointLight(0x4499ff, 1.2, [10, 5, 10]); // Blue-ish light from top-right
        createPointLight(0xffffff, 1.0, [-10, -5, 10]); // White light from bottom-left
        createPointLight(0x99ccff, 0.8, [0, 10, -10]); // Light blue from behind
        
        // Optional: Add a spotlight for dramatic effect
        const spotlight = new THREE.SpotLight(0xffffff, 1.5, 100, Math.PI / 6, 0.5);
        spotlight.position.set(0, 15, 15);
        spotlight.lookAt(0, 0, 0);
        scene.add(spotlight);
        threeRef.current.lights.push(spotlight);
        
        // Animation function with enhanced light movement
        const animate = () => {
          threeRef.current.animationId = requestAnimationFrame(animate);
          
          const time = Date.now() * 0.001;
          
          // Animate lights subtly
          threeRef.current.lights.forEach((light, index) => {
            // Skip the directional light to keep main lighting consistent
            if (index > 0) {
              // Create subtle oscillating movement
              const radius = 10 + Math.sin(time * 0.5) * 2;
              const angle = time * 0.3 + (index * Math.PI / 3);
              
              light.position.x = Math.cos(angle) * radius;
              light.position.z = Math.sin(angle) * radius;
            }
          });
          
          if (autoRotate) {
            cube.rotation.y += rotationSpeed;
          }
          
          renderer.render(scene, camera);
        };
        
        animate();

        // Mouse and touch interaction - can be 2D or 3D based on 'spin' prop
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        const handleMouseDown = (e) => {
          isDragging = true;
          previousMousePosition = {
            x: e.clientX,
            y: e.clientY
          };
        };
        
        const handleMouseMove = (e) => {
          if (!isDragging) return;
          
          const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
          };
          
          // Always allow horizontal rotation (y-axis)
          cube.rotation.y += deltaMove.x * 0.01;
          
          // Only allow vertical rotation (x-axis) if spin is enabled
          if (spin) {
            cube.rotation.x += deltaMove.y * 0.01;
          }
          
          previousMousePosition = {
            x: e.clientX,
            y: e.clientY
          };
        };
        
        const handleMouseUp = () => {
          isDragging = false;
        };
        
        const handleTouchStart = (e) => {
          if (e.touches.length === 1) {
            isDragging = true;
            previousMousePosition = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY
            };
          }
        };
        
        const handleTouchMove = (e) => {
          if (!isDragging || e.touches.length !== 1) return;
          
          const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
          };
          
          // Always allow horizontal rotation (y-axis)
          cube.rotation.y += deltaMove.x * 0.01;
          
          // Only allow vertical rotation (x-axis) if spin is enabled
          if (spin) {
            cube.rotation.x += deltaMove.y * 0.01;
          }
          
          previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };
        };
        
        const handleTouchEnd = () => {
          isDragging = false;
        };
        
        // Add event listeners
        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        renderer.domElement.addEventListener('touchstart', handleTouchStart);
        renderer.domElement.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        
        // Simple resize handler
        const handleResize = () => {
          if (!containerRef.current) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          
          // Update cube size on resize
          const newCubeSize = getResponsiveDimensions();
          cube.geometry.dispose();
          cube.geometry = new THREE.BoxGeometry(newCubeSize, newCubeSize, newCubeSize);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          if (threeRef.current.animationId) {
            cancelAnimationFrame(threeRef.current.animationId);
          }
          
          window.removeEventListener('resize', handleResize);
          renderer.domElement.removeEventListener('mousedown', handleMouseDown);
          renderer.domElement.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          renderer.domElement.removeEventListener('touchstart', handleTouchStart);
          renderer.domElement.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        };
      } catch (error) {
        console.error('Error initializing Three.js:', error);
        setIsLoading(false);
      }
    };
    
    init();
    
    return () => {
      if (threeRef.current.animationId) {
        cancelAnimationFrame(threeRef.current.animationId);
      }
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [darkMode, showText, cubeColor, autoRotate, rotationSpeed, sectionData]);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '90vh', // Reduced from 100vh to reduce vertical padding
      py: 0, // Keep padding at 0 as requested
      backgroundColor: 'transparent',
      overflow: 'hidden' // Prevent scrolling
    }}>
      <Box
        ref={containerRef}
        sx={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: 'transparent',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)' // Perfect centering
        }}
      />
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CircularProgress color="primary" />
          <Box>Loading 3D content...</Box>
        </Box>
      )}
    </Box>
  );
};

FeatureCube.propTypes = {
  /** Enable dark mode styling */
  darkMode: PropTypes.bool,
  
  /** Show or hide text on cube faces */
  showText: PropTypes.bool,
  
  /** Custom color for cube faces (hex number) */
  cubeColor: PropTypes.number,
  
  /** Enable automatic rotation */
  autoRotate: PropTypes.bool,
  
  /** Enable vertical (top to bottom) rotation when dragging */
  spin: PropTypes.bool,
  
  /** Padding on Y-axis */
  paddingY: PropTypes.number,
  
  /** Speed of automatic rotation */
  rotationSpeed: PropTypes.number,
  
  /** Section data to display on cube faces */
  sectionData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  )
};

export default FeatureCube;