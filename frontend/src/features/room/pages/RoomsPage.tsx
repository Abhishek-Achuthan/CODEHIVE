import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../shared/ui/PageHeader";
import { RoomList } from "../components/RoomList";
import { useRooms } from "../hooks/useRooms";
import { useMyRooms } from "../hooks/useMyRooms";
import { QnaBackgroundGlow } from "../../../shared/ui/QnaBackgroundGlow";
import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import CreateRoomModal from "../components/CreateRoomModal";
import { CreateRoomButton } from "../components/CreateRoomButton";
import { RoomViewTabs, type RoomListTab } from "../components/RoomViewTabs";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { RoomsSidebar } from "../components/RoomsSidebar";
import { MyRoomsToolbar } from "../components/MyRoomsToolbar";
import type { MyRoomsVisibilityFilter } from "../components/MyRoomsVisibilityTabs";

const LIST_PARAMS = { page: 1, limit: 5 };

const RoomsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RoomListTab>("public");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const publicRooms = useRooms(LIST_PARAMS);
  const myRoomsEnabled = activeTab === "mine" && Boolean(user);
  const myRooms = useMyRooms(myRoomsEnabled);

  const isPublicTab = activeTab === "public";
  const { isLoading, error } = isPublicTab ? publicRooms : myRooms;

  const handleTabChange = (tab: RoomListTab) => {
    setActiveTab(tab);
    if (tab === "mine") {
      myRooms.setCurrentPage(1);
    } else {
      myRooms.resetSearch();
    }
  };

  const handleMyRoomsPageChange = (page: number) => {
    myRooms.setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (
      myRoomsEnabled &&
      myRooms.rooms &&
      myRooms.currentPage > myRooms.totalPages &&
      myRooms.totalPages >= 1
    ) {
      myRooms.setCurrentPage(myRooms.totalPages);
    }
  }, [myRoomsEnabled, myRooms.rooms, myRooms.currentPage, myRooms.totalPages]);

  const headerCopy =
    activeTab === "public"
      ? {
          title: "Discover Public Rooms",
          description:
            "Explore ongoing discussions and collaborative spaces. Join any public room to participate.",
        }
      : {
          title: "My Rooms",
          description:
            "Rooms you created — public and private. Open any room to continue collaborating or share your invite link.",
        };

  const myRoomsEmptyCopy = getMyRoomsEmptyCopy(
    myRooms.debouncedSearch,
    myRooms.visibility,
  );

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <div className="relative flex-1">
        <QnaBackgroundGlow />

        <div className="flex flex-1">
          <RoomsSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isSignedIn={Boolean(user)}
          />

          <main className="relative flex-1 overflow-y-auto">
            <div className="relative w-full p-6">
              <PageHeader
                label="Rooms"
                title={headerCopy.title}
                description={headerCopy.description}
              >
                <CreateRoomButton
                  size="compact"
                  onClick={() => setIsModalOpen(true)}
                />
              </PageHeader>

              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:hidden">
                <RoomViewTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>

              {activeTab === "mine" && user ? (
                <MyRoomsToolbar
                  visibility={myRooms.visibility}
                  onVisibilityChange={myRooms.setVisibility}
                  searchTerm={myRooms.searchTerm}
                  onSearchChange={myRooms.setSearchTerm}
                />
              ) : null}

              {activeTab === "mine" && !user ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/40 py-20 text-center backdrop-blur-xl">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    Sign in to view your rooms
                  </h3>
                  <p className="mb-6 max-w-sm text-zinc-500">
                    Your private and public rooms appear here after you sign in.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                  >
                    Sign in
                  </Link>
                </div>
              ) : (
                <RoomList
                  rooms={isPublicTab ? publicRooms.data : myRooms.rooms}
                  isLoading={isLoading}
                  error={error}
                  actionLabel={isPublicTab ? "Join Room" : "Open Room"}
                  emptyTitle={
                    isPublicTab
                      ? "No public rooms available"
                      : myRoomsEmptyCopy.title
                  }
                  emptyDescription={
                    isPublicTab
                      ? "Be the first to create one! Use Create Room to start a collaborative space."
                      : myRoomsEmptyCopy.description
                  }
                  pagination={
                    !isPublicTab
                      ? {
                          currentPage: myRooms.currentPage,
                          totalPages: myRooms.totalPages,
                          totalItems: myRooms.totalItems,
                          onPageChange: handleMyRoomsPageChange,
                        }
                      : undefined
                  }
                />
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />

      <CreateRoomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          void publicRooms.refetch();
          myRooms.setCurrentPage(1);
          void myRooms.refetch();
        }}
      />
    </div>
  );
};

function getMyRoomsEmptyCopy(
  debouncedSearch: string,
  visibility: MyRoomsVisibilityFilter,
) {
  if (debouncedSearch) {
    return {
      title: "No rooms match your search",
      description: "Try a different title or clear the search field.",
    };
  }

  if (visibility === "private") {
    return {
      title: "No private rooms yet",
      description:
        "Create a private room to collaborate via invite links only.",
    };
  }

  if (visibility === "public") {
    return {
      title: "No public rooms yet",
      description: "Create a public room to let others request to join.",
    };
  }

  return {
    title: "You have not created any rooms yet",
    description:
      "Create a public or private room to start collaborating with your team.",
  };
}

export default RoomsPage;
