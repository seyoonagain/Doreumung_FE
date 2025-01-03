'use client';

import { useEffect, useState } from 'react';
import { jejuArea } from './jejumap';
import { KakaoMouseEvent } from '../types';

const RegionMap = () => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // 카카오맵 로드
      window.kakao.maps.load(() => {
        const container = document.getElementById('map') as HTMLElement;

        const isMobile = window.innerWidth <= 640;
        const level = isMobile ? 11 : 10;

        const options = {
          center: new window.kakao.maps.LatLng(33.369, 126.571),
          level: level,
        };

        const map = new window.kakao.maps.Map(container, options);
        const customOverlay = new window.kakao.maps.CustomOverlay({
          map: null,
          content: '',
        });

        const selectedPolygons = new Set();

        // 제주 구역 다각형 생성
        jejuArea.forEach(area => {
          const polygon = new window.kakao.maps.Polygon({
            map: map,
            path: area.path.map(point => new window.kakao.maps.LatLng(point.lat, point.lng)),
            strokeWeight: 2,
            strokeColor: '#6D6D6D',
            strokeOpacity: 0.8,
            fillColor: '#DBEBCC',
            fillOpacity: 0.7,
          });

          // 마우스 이벤트
          window.kakao.maps.event.addListener(
            polygon,
            'mouseover',
            (mouseEvent: KakaoMouseEvent) => {
              if (!selectedPolygons.has(polygon)) {
                polygon.setOptions({
                  fillColor: '#BEDAA3',
                });
              }

              const content = document.createElement('div');
              content.className =
                'absolute -top-[5px] left-4 p-1 border border-gray-400 rounded-md bg-background text-xs';
              content.textContent = area.name;

              customOverlay.setContent(content);
              customOverlay.setPosition(mouseEvent.latLng);
              customOverlay.setMap(map);
            },
          );

          window.kakao.maps.event.addListener(
            polygon,
            'mousemove',
            (mouseEvent: KakaoMouseEvent) => {
              customOverlay.setPosition(mouseEvent.latLng);
            },
          );

          window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
            if (!selectedPolygons.has(polygon)) {
              polygon.setOptions({
                fillColor: '#DBEBCC',
              });
            }

            customOverlay.setMap(null);
          });

          window.kakao.maps.event.addListener(polygon, 'click', () => {
            if (selectedPolygons.has(polygon)) {
              selectedPolygons.delete(polygon);
              polygon.setOptions({
                fillColor: '#DBEBCC',
              });
              setSelectedAreas(prev => prev.filter(name => name !== area.name));
            } else {
              selectedPolygons.add(polygon);
              polygon.setOptions({
                fillColor: '#9EC07F',
              });
              setSelectedAreas(prev => [...prev, area.name]);
            }
          });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] md:h-[500px]">
      <div className="absolute top-4 left-4 z-10 max-w-[calc(100%-2rem)] p-2 border border-darkGray rounded-md shadow-md bg-white text-xs text-darkerGray md:text-base">
        <strong className="text-logo">선택된 지역: </strong>{' '}
        {selectedAreas.length > 0 ? selectedAreas.join(', ') : '없음'}
      </div>
      <div id="map" className="absolute top-0 left-0 w-full h-full rounded-lg" />
    </div>
  );
};

export default RegionMap;
