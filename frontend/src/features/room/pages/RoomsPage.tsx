import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../shared/ui/PageHeader";
import { RoomList } from "../components/RoomList";
import { useRooms } from "../hooks/useRooms";
import { MY_ROOMS_PAGE_SIZE, useMyRooms } from "../hooks/useMyRooms";
import { QnaBackgroundGlow } from "../../../shared/ui/QnaBackgroundGlow";
import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import CreateRoomModal from "../components/CreateRoomModal";
import { CreateRoomButton } from "../components/CreateRoomButton";
import { RoomViewTabs, type RoomListTab } from "../components/RoomViewTabs";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { RoomsSidebar } from "../components/RoomsSidebar";
import type { RoomVisibility } from "../../../shared/types/api/room";

const LIST_PARAMS = { page: 1, limit: 5 };

type MyRoomsVisibilityFilter = "all" | "public" | "private";

const RoomsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RoomListTab>("public");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myRoomsPage, setMyRoomsPage] = useState(1);
  const [myRoomsVisibility, setMyRoomsVisibility] =
    useState<MyRoomsVisibilityFilter>("all");
  const user = useAppSelector((state) => state.auth.user);

  const publicRooms = useRooms(LIST_PARAMS);
  const myRoomsEnabled = activeTab === "mine" && Boolean(user);
  const myRooms = useMyRooms(myRoomsPage, myRoomsEnabled, MY_ROOMS_PAGE_SIZE);

  const isPublicTab = activeTab === "public";
  const { isLoading, error } = isPublicTab ? publicRooms : myRooms;

  const handleTabChange = (tab: RoomListTab) => {
    setActiveTab(tab);
    if (tab === "mine") {
      setMyRoomsPage(1);
    }
  };

  const handleVisibilityChange = (next: MyRoomsVisibilityFilter) => {
    setMyRoomsVisibility(next);
    setMyRoomsPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMyRoomsPageChange = (page: number) => {
    setMyRoomsPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (
      myRoomsEnabled &&
      myRooms.data &&
      myRoomsPage > myRooms.totalPages &&
      myRooms.totalPages >= 1
    ) {
      setMyRoomsPage(myRooms.totalPages);
    }
  }, [myRoomsEnabled, myRooms.data, myRoomsPage, myRooms.totalPages]);

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

  const visibilityFilterToRoomVisibility = (
    filter: MyRoomsVisibilityFilter,
  ): RoomVisibility | null => {
    if (filter === "private") return "PRIVATE";
    if (filter === "public") return "PUBLIC_REQUEST";
    return null;
  };

  const filteredRooms = (() => {
    if (isPublicTab) return publicRooms.data;
    const rooms = myRooms.data;
    if (!rooms) return rooms;

    const visibility = visibilityFilterToRoomVisibility(myRoomsVisibility);
    if (!visibility) return rooms;

    return {
      ...rooms,
      items: rooms.items.filter((room) => room.visibility === visibility),
    };
  })();

  const myRoomsEmptyCopy =
    myRoomsVisibility === "private"
      ? {
          title: "No private rooms yet",
          description:
            "Create a private room to collaborate via invite links only.",
        }
      : myRoomsVisibility === "public"
        ? {
            title: "No public rooms yet",
            description:
              "Create a public room to let others request to join.",
          }
        : {
            title: "You have not created any rooms yet",
            description:
              "Create a public or private room to start collaborating with your team.",
          };

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
                <div className="mb-8 flex items-center justify-between">
                  <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
                    {(
                      [
                        { value: "all", label: "All" },
                        { value: "public", label: "Public" },
                        { value: "private", label: "Private" },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleVisibilityChange(option.value)}
                        className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${
                          myRoomsVisibility === option.value
                            ? "bg-white text-black shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
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
                  rooms={filteredRooms}
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
          setMyRoomsPage(1);
          void myRooms.refetch();
        }}
      />
    </div>
  );
};

export default RoomsPage;
