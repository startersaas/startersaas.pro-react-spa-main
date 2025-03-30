import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * FeatureSphere - A 3D sphere component that displays feature text curved around its surface
 */
const FeatureSphere = ({
  darkMode = false,
  showText = true,
  sphereColor,
  autoRotate = false,
  paddingY = 10,
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
    sphere: null,
    textGroups: [],
    animationId: null
  });
  
  // Determine sphere color based on props or default to dark mode setting
  const determineSphereColor = () => {
    if (sphereColor) return sphereColor;
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
        
        // Camera setup - position further back to see the whole sphere
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 20;
        threeRef.current.camera = camera;
        
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // Set transparent background
        containerRef.current.appendChild(renderer.domElement);
        threeRef.current.renderer = renderer;
        
        // Create sphere with responsive sizing
        const getResponsiveDimensions = () => {
          // Get actual viewport width
          const viewportWidth = window.innerWidth;
          
          // Determine size based on breakpoints
          let sphereRadius;
          
          if (viewportWidth < 600) {
            sphereRadius = 5; // Base size for mobile
          } else if (viewportWidth < 960) {
            sphereRadius = 7; // Larger for sm
          } else if (viewportWidth < 1280) {
            sphereRadius = 8; // Even larger for md
          } else if (viewportWidth < 1920) {
            sphereRadius = 9; // Very large for lg
          } else {
            sphereRadius = 10; // Largest for xl
          }
          
          return sphereRadius;
        };
        
        const sphereRadius = getResponsiveDimensions();
        // Higher segment count for smoother sphere and better text positioning
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
        
        // Create material with color and slight transparency
        const sphereColor = determineSphereColor();
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
          color: sphereColor,
          metalness: 0.3,
          roughness: 0.4,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);
        threeRef.current.sphere = sphere;

        // Add text if enabled
        if (showText) {
          // Function to add curved text around the sphere
          const addTextToSphere = () => {
            // Load font from CDN
            const loader = new THREE.FontLoader();
            const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';
            
            loader.load(fontUrl, function(font) {
              const sectionsToUse = sectionData || defaultSectionData;
              
              // Clear existing text groups
              threeRef.current.textGroups.forEach(group => {
                scene.remove(group);
              });
              threeRef.current.textGroups = [];
              
              // Calculate positions for sections around the sphere
              sectionsToUse.forEach((section, sectionIndex) => {
                const totalSections = sectionsToUse.length;
                
                // Create group for this section
                const sectionGroup = new THREE.Group();
                
                // Position this section on the sphere
                // Distribute sections evenly around the sphere
                const sectionAngle = (sectionIndex / totalSections) * Math.PI * 2;
                const radius = sphereRadius + 0.1; // Slightly outside sphere
                
                // Title configuration
                const titleOptions = {
                  font: font,
                  size: 0.4,
                  height: 0.05,
                  curveSegments: 12,
                  bevelEnabled: false
                };
                
                // Create title
                const titleGeo = new THREE.TextGeometry(section.title, titleOptions);
                titleGeo.computeBoundingBox();
                const titleWidth = titleGeo.boundingBox.max.x - titleGeo.boundingBox.min.x;
                const titleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const titleMesh = new THREE.Mesh(titleGeo, titleMaterial);
                
                // Position and rotate the title
                const titleLatitude = 0; // On the "equator" of the sphere
                const titleX = Math.cos(sectionAngle) * (radius + 0.2);
                const titleY = Math.sin(titleLatitude) * radius; 
                const titleZ = Math.sin(sectionAngle) * (radius + 0.2);
                
                titleMesh.position.set(titleX, titleY, titleZ);
                
                // Make text face outward from the center
                titleMesh.lookAt(titleX * 2, titleY * 2, titleZ * 2);
                
                // Adjust title position to center it
                const titleOffset = new THREE.Vector3(-titleWidth / 2, 0, 0);
                titleOffset.applyQuaternion(titleMesh.quaternion);
                titleMesh.position.add(titleOffset);
                
                sectionGroup.add(titleMesh);
                
                // Add items curving downward from the title
                const itemOptions = {
                  font: font,
                  size: 0.25,
                  height: 0.02,
                  curveSegments: 4,
                  bevelEnabled: false
                };
                
                section.items.forEach((item, itemIndex) => {
                  // Place items in a curved path below the title
                  const itemLatitude = -((itemIndex + 1) * 0.15); // Move down the sphere
                  
                  const itemGeo = new THREE.TextGeometry(item, itemOptions);
                  itemGeo.computeBoundingBox();
                  const itemWidth = itemGeo.boundingBox.max.x - itemGeo.boundingBox.min.x;
                  
                  const itemMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                  const itemMesh = new THREE.Mesh(itemGeo, itemMaterial);
                  
                  // Position items along the curved path
                  const itemX = Math.cos(sectionAngle) * radius * Math.cos(itemLatitude);
                  const itemY = Math.sin(itemLatitude) * radius;
                  const itemZ = Math.sin(sectionAngle) * radius * Math.cos(itemLatitude);
                  
                  itemMesh.position.set(itemX, itemY, itemZ);
                  
                  // Make text face outward from center
                  itemMesh.lookAt(itemX * 2, itemY * 2, itemZ * 2);
                  
                  // Center the text
                  const itemOffset = new THREE.Vector3(-itemWidth / 2, 0, 0);
                  itemOffset.applyQuaternion(itemMesh.quaternion);
                  itemMesh.position.add(itemOffset);
                  
                  sectionGroup.add(itemMesh);
                });
                
                scene.add(sectionGroup);
                threeRef.current.textGroups.push(sectionGroup);
              });
            });
          };
          
          addTextToSphere();
        }
        
        // Enhanced lighting for better visibility of curved text
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Add directional lights from multiple angles
        const createDirectionalLight = (x, y, z, intensity) => {
          const light = new THREE.DirectionalLight(0xffffff, intensity);
          light.position.set(x, y, z);
          scene.add(light);
          return light;
        };
        
        createDirectionalLight(10, 0, 0, 0.8);
        createDirectionalLight(-10, 0, 0, 0.8);
        createDirectionalLight(0, 10, 0, 0.8);
        createDirectionalLight(0, -10, 0, 0.8);
        createDirectionalLight(0, 0, 10, 1.2);
        
        // Animation function with optional auto-rotation
        const animate = () => {
          threeRef.current.animationId = requestAnimationFrame(animate);
          
          if (autoRotate) {
            sphere.rotation.y += rotationSpeed;
          }
          
          renderer.render(scene, camera);
        };
        
        animate();

        // Mouse and touch interaction for sphere rotation
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
          sphere.rotation.y += deltaMove.x * 0.01;
          
          // Only allow vertical rotation (x-axis) if spin is enabled
          if (spin) {
            sphere.rotation.x += deltaMove.y * 0.01;
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
          sphere.rotation.y += deltaMove.x * 0.01;
          
          // Only allow vertical rotation (x-axis) if spin is enabled
          if (spin) {
            sphere.rotation.x += deltaMove.y * 0.01;
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
        
        // Handle resizing
        const handleResize = () => {
          if (!containerRef.current) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          
          // Update sphere size on resize
          const newSphereRadius = getResponsiveDimensions();
          sphere.geometry.dispose();
          sphere.geometry = new THREE.SphereGeometry(newSphereRadius, 64, 64);
          
          // Reposition text
          if (showText) {
            const sectionsToUse = sectionData || defaultSectionData;
            if (sectionsToUse.length > 0) {
              // Re-add text with new sphere size
              threeRef.current.textGroups.forEach(group => {
                scene.remove(group);
              });
              
              const loader = new THREE.FontLoader();
              const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';
              loader.load(fontUrl, () => {
                // Re-add text
                addTextToSphere();
              });
            }
          }
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
  }, [darkMode, showText, sphereColor, autoRotate, rotationSpeed, sectionData]);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', // Full viewport height
      py: 0, // Remove padding
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

FeatureSphere.propTypes = {
  /** Enable dark mode styling */
  darkMode: PropTypes.bool,
  
  /** Show or hide text on sphere */
  showText: PropTypes.bool,
  
  /** Custom color for sphere (hex number) */
  sphereColor: PropTypes.number,
  
  /** Enable automatic rotation */
  autoRotate: PropTypes.bool,
  
  /** Enable vertical rotation when dragging */
  spin: PropTypes.bool,
  
  /** Padding on Y-axis */
  paddingY: PropTypes.number,
  
  /** Speed of automatic rotation */
  rotationSpeed: PropTypes.number,
  
  /** Section data to display around sphere */
  sectionData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  )
};

export default FeatureSphere;

