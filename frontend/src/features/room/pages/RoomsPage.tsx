import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { RoomList } from "../components/RoomList";
import { useRooms } from "../hooks/useRooms";
import { useMyRooms } from "../hooks/useMyRooms";
import { QnaBackgroundGlow } from "../../../shared/ui/QnaBackgroundGlow";
import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import CreateRoomModal from "../components/CreateRoomModal";
import { RoomViewTabs, type RoomListTab } from "../components/RoomViewTabs";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { MyRoomsToolbar } from "../components/MyRoomsToolbar";
import type { MyRoomsVisibilityFilter } from "../components/MyRoomsVisibilityTabs";
import { useDebounce } from "../../../shared/hooks/useDebounce";

const RoomsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RoomListTab>("public");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicSearchTerm, setPublicSearchTerm] = useState("");
  const trimmedPublicSearch = publicSearchTerm.trim();
  const debouncedPublicSearch = useDebounce(trimmedPublicSearch, 500);
  const effectivePublicSearch = trimmedPublicSearch === "" ? "" : debouncedPublicSearch;

  const isPublicSearchPending = trimmedPublicSearch !== "" && trimmedPublicSearch !== effectivePublicSearch;

  const user = useAppSelector((state) => state.auth.user);

  const publicRooms = useRooms(
    useMemo(() => ({ page: 1, limit: 12, search: effectivePublicSearch || undefined }), [effectivePublicSearch])
  );
  const myRoomsEnabled = activeTab === "mine" && Boolean(user);
  const myRooms = useMyRooms(myRoomsEnabled);

  const isPublicTab = activeTab === "public";
  const { isLoading, error } = isPublicTab 
    ? { isLoading: publicRooms.isLoading || isPublicSearchPending, error: publicRooms.error }
    : myRooms;

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
          title: "Explore the Community",
          description:
            "Connect with like-minded developers, join live coding sessions, and collaborate on exciting projects in real-time.",
        }
      : {
          title: "Your Creative Spaces",
          description:
            "Manage your private and public rooms. Invite collaborators, host sessions, and bring your ideas to life.",
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

        <div className="flex flex-1 justify-center">
          <main className="relative w-full max-w-7xl flex-1 overflow-y-auto">
            <div className="relative w-full p-6 lg:p-8">
              <div className="flex flex-col items-center text-center mb-12 mt-8">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic mb-4">
                  {headerCopy.title}
                </h1>
                <p className="mt-3 text-lg sm:text-xl leading-relaxed text-zinc-300 max-w-2xl font-medium">
                  {headerCopy.description}
                </p>
              </div>

              <MyRoomsToolbar
                leftSlot={
                  <RoomViewTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                  />
                }
                showVisibility={activeTab === "mine" && Boolean(user)}
                visibility={myRooms.visibility}
                onVisibilityChange={myRooms.setVisibility}
                showSearch={activeTab === "public" || Boolean(user)}
                searchTerm={isPublicTab ? publicSearchTerm : myRooms.searchTerm}
                onSearchChange={isPublicTab ? setPublicSearchTerm : myRooms.setSearchTerm}
                searchPlaceholder={isPublicTab ? "Search public rooms..." : "Search your rooms..."}
                onCreateRoom={() => setIsModalOpen(true)}
              />

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
                      ? (effectivePublicSearch ? "No rooms match your search" : "No public rooms available")
                      : myRoomsEmptyCopy.title
                  }
                  emptyDescription={
                    isPublicTab
                      ? (effectivePublicSearch ? "Try a different title or clear the search field." : "Be the first to create one! Use Create Room to start a collaborative space.")
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
