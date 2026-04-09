import { PageHeader } from '../../../shared/ui/PageHeader';
import { RoomList } from '../components/RoomList';
import { useRooms } from '../hooks/useRooms';
import { QnaBackgroundGlow } from '../../../shared/ui/QnaBackgroundGlow';
import Header from '../../../shared/ui/Header';
import Footer from '../../../shared/ui/Footer';

const RoomsPage: React.FC = () => {
    const { data, isLoading, error } = useRooms();

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Header />
            <main className="flex-grow relative px-4 py-12 sm:px-6 lg:px-8">
                <QnaBackgroundGlow />
                
                <div className="relative max-w-7xl mx-auto">
                    <PageHeader 
                        label="Rooms"
                        title="Discover Public Rooms"
                        description="Explore ongoing discussions and collaborative spaces. Join any public room to participate in the conversation."
                    />

                    <div className="mt-8">
                        <RoomList rooms={data} isLoading={isLoading} error={error} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RoomsPage;
