import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { RoomList } from "../components/RoomList";
import { useRooms } from "../hooks/useRooms";
import { useMyRooms } from "../hooks/useMyRooms";
import { QnaBackgroundGlow } from "../../../shared/ui/QnaBackgroundGlow";
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
  const [publicDateFilter, setPublicDateFilter] = useState("");
  const [publicStatusFilter, setPublicStatusFilter] = useState("");

  const trimmedPublicSearch = publicSearchTerm.trim();
  const debouncedPublicSearch = useDebounce(trimmedPublicSearch, 500);
  const effectivePublicSearch =
    trimmedPublicSearch === "" ? "" : debouncedPublicSearch;

  const isPublicSearchPending =
    trimmedPublicSearch !== "" && trimmedPublicSearch !== effectivePublicSearch;

  const user = useAppSelector((state) => state.auth.user);

  const publicRooms = useRooms(
    useMemo(
      () => ({
        page: 1,
        limit: 12,
        search: effectivePublicSearch || undefined,
        dateFrom: publicDateFilter || undefined,
        status: publicStatusFilter || undefined,
      }),
      [effectivePublicSearch, publicDateFilter, publicStatusFilter],
    ),
  );
  const myRoomsEnabled = activeTab === "mine" && Boolean(user);
  const myRooms = useMyRooms(myRoomsEnabled);

  const isPublicTab = activeTab === "public";
  const { isLoading, error } = isPublicTab
    ? {
        isLoading: publicRooms.isLoading || isPublicSearchPending,
        error: publicRooms.error,
      }
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
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <QnaBackgroundGlow />

        <div className="flex flex-1 justify-center">
          <main className="relative w-full max-w-7xl flex-1 pb-10">
            <div className="relative w-full p-6 lg:p-8">
              <div className="mb-6 flex flex-col items-start border-b border-white/10 pb-4">
                <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
                  {headerCopy.title}
                </h1>
                <p className="text-sm text-zinc-400">
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
                onSearchChange={
                  isPublicTab ? setPublicSearchTerm : myRooms.setSearchTerm
                }
                dateFilter={isPublicTab ? publicDateFilter : myRooms.dateFilter}
                onDateFilterChange={
                  isPublicTab ? setPublicDateFilter : myRooms.setDateFilter
                }
                statusFilter={
                  isPublicTab ? publicStatusFilter : myRooms.statusFilter
                }
                onStatusFilterChange={
                  isPublicTab ? setPublicStatusFilter : myRooms.setStatusFilter
                }
                searchPlaceholder={
                  isPublicTab
                    ? "Search public rooms..."
                    : "Search your rooms..."
                }
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
                      ? effectivePublicSearch
                        ? "No rooms match your search"
                        : "No public rooms available"
                      : myRoomsEmptyCopy.title
                  }
                  emptyDescription={
                    isPublicTab
                      ? effectivePublicSearch
                        ? "Try a different title or clear the search field."
                        : "Be the first to create one! Use Create Room to start a collaborative space."
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
