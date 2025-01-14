import BackNavigation from '@/components/common/backNavigation/BackNavigation';
import TravelHeader from '../TravelHeader';
import PlaceList from './PlaceList';
import TravelPlanMap from './TravelPlanMap';
import ResizeablePanel from './ResizeablePanel';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LayerPopup from '@/components/common/layerPopup/LayerPopup';

const TravelPlan = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showNavigationPopup, setShowNavigationPopup] = useState(false);
  const [navigationPath, setNavigationPath] = useState('');

  const handleNavigation = (path: string) => {
    setNavigationPath(path);
    setShowNavigationPopup(true);
  };

  const handleNavigationConfirm = () => {
    router.push(navigationPath);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      <div className="px-4 flex-shrink-0 md:flex md:flex-col md:w-[440px] md:px-0">
        <div className="pb-4 md:px-8">
          <header className="pt-8 text-base md:pt-6">
            <BackNavigation to="home" onNavigate={handleNavigation} />
          </header>
          <TravelHeader
            step="마음에 드는 장소는 고정하고 다시 뽑을 수 있어요!"
            stepName="일정 확인"
          />
        </div>
        <div className="flex-grow overflow-auto">{!isMobile && <PlaceList />}</div>
      </div>

      <div className="flex-1 relative z-0 h-full">
        <TravelPlanMap />
      </div>
      {isMobile && (
        <ResizeablePanel initialHeight={400} minHeight={200} maxHeight={window.innerHeight - 200}>
          <PlaceList />
        </ResizeablePanel>
      )}

      {showNavigationPopup && (
        <LayerPopup
          type="confirm"
          label={<>작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?</>}
          onConfirm={handleNavigationConfirm}
          setShowLayerPopup={setShowNavigationPopup}
        />
      )}
    </div>
  );
};

export default TravelPlan;