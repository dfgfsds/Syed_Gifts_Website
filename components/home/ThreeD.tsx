'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import Image from 'next/image';

interface TeaCupProps {
    onProductChange: (index: number) => void;
}

const products = [
    {
        id: 0,
        name: 'Green Tea',
        label: 'Зелений чай',
        image: 'https://ecomapi.ftdigitalsolutions.org/media/001_46571941.png'
    },
    {
        id: 1,
        name: 'Berry Tea',
        label: 'Ягідний чай',
        image: 'https://ecomapi.ftdigitalsolutions.org/media/002_18646508.png'
    },
    {
        id: 2,
        name: 'Green Tea',
        label: 'Зелений чай',
        image: 'https://ecomapi.ftdigitalsolutions.org/media/004_24981290.png'
    },
    {
        id: 3,
        name: 'Green Tea',
        label: 'Зелений чай',
        image: 'https://ecomapi.ftdigitalsolutions.org/media/006_52460250.png'
    }
];

const ThreeD: React.FC<TeaCupProps> = ({ onProductChange }) => {
    const [currentRotation, setCurrentRotation] = useState(0);
    const [activeProductIndex, setActiveProductIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const springRotation = useSpring(0, { stiffness: 100, damping: 30 });
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const snapToProduct = (rotation: number) => {
        const productAngle = 360 / products.length;
        const normalizedRotation = ((rotation % 360) + 360) % 360;
        const targetProduct = Math.round(normalizedRotation / productAngle);
        const targetRotation = targetProduct * productAngle;
        springRotation.set(targetRotation);

        const newIndex = targetProduct % products.length;
        if (newIndex !== activeProductIndex) {
            setActiveProductIndex(newIndex);
            onProductChange(newIndex);
        }
    };

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);

            const isHorizontal = absX > absY;

            if (isHorizontal || (e.shiftKey && absY > 0)) {
                e.preventDefault();
                const sensitivity = 1.2;
                const delta = e.shiftKey ? e.deltaY : e.deltaX;
                const newRotation = currentRotation + delta * sensitivity;
                setCurrentRotation(newRotation);

                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    snapToProduct(newRotation);
                }, 100);
            }
        };

        let touchStartX = 0;
        let touchStartY = 0;
        let lastTouchX = 0;
        let isTouching = false;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            lastTouchX = touchStartX;
            isTouching = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isTouching) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;

            const deltaX = Math.abs(touchX - touchStartX);
            const deltaY = Math.abs(touchY - touchStartY);

            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
                const moveDelta = lastTouchX - touchX;
                lastTouchX = touchX;

                const newRotation = currentRotation + moveDelta * 1.5;
                setCurrentRotation(newRotation);

                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    snapToProduct(newRotation);
                }, 100);
            }
        };

        const handleTouchEnd = () => {
            isTouching = false;
        };

        const element = containerRef.current;
        if (element) {
            element.addEventListener('wheel', handleWheel, { passive: false });
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
            element.addEventListener('touchmove', handleTouchMove, { passive: false });
            element.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (element) {
                element.removeEventListener('wheel', handleWheel);
                element.removeEventListener('touchstart', handleTouchStart);
                element.removeEventListener('touchmove', handleTouchMove);
                element.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [currentRotation]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center perspective-1000"
        >
            <motion.div
                className="relative w-96 h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] transform-style-3d mt-12"
                style={{
                    rotateY: springRotation,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                }}
            >
                {products.map((product, index) => {
                    const angle = (360 / products.length) * index;
                    return (
                        <motion.div
                            key={product.id}
                            className="absolute w-full h-full"
                            style={{
                                rotateY: angle,
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div className="relative w-full h-full flex flex-col items-center justify-center">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 256px, (max-width: 1200px) 320px, 384px"
                                        priority
                                    />
                                </div>
                                {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
                                    {product.label}
                                </div> */}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default ThreeD;