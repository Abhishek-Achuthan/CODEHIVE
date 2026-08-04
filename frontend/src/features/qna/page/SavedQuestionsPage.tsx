import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import QnaLayout from "../../../layouts/QnaLayout";
import SavedListsSidebar from "../components/SavedListsSidebar";
import SavedQuestionsMain from "../components/SavedQuestionsMain";
import CreateSavedListModal from "../components/CreateSavedListModal";
import AddToSavedListModal from "../components/AddToSavedListModal";
import ConfirmDeleteListModal from "../components/ConfirmDeleteListModal";
import { QuestionHeader } from "../components/QuestionHeader";
import { useSavedQuestionsPage } from "../hooks/useSavedQuestionsPage";

export default function SavedQuestionsPage() {
  const navigate = useNavigate();

  const {
    lists,
    listsLoading,
    selected,
    handleSelectAll,
    handleSelectList,

    questions,
    totalQuestions,
    loading,

    currentPage,
    setCurrentPage,

    searchTerm,
    setSearchTerm,

    totalPages,
    headerTitle,
    headerCountLabel,

    createListOpen,
    setCreateListOpen,
    handleOpenCreateList,
    handleCreateList,

    addToListOpen,
    setAddToListOpen,
    handleOpenAddToList,
    handleSelectAddList,

    addedListIds,
    loadingAddedListIds,
    addingToListId,

    removingQuestionId,
    handleRemoveFromCurrentList,

    unsavingQuestionId,
    handleUnsaveQuestion,

    deleteListOpen,
    setDeleteListOpen,
    deleteListName,
    deletingList,
    handleOpenDeleteList,
    handleConfirmDeleteList,

    setReopenAddAfterCreate,
  } = useSavedQuestionsPage();

  const questionsWithActions = useMemo(() => questions, [questions]);

  const handleQuestionClick = (id: string) => {
    navigate(`/qna/question/${id}`);
  };

  return (
    <QnaLayout>
      <QuestionHeader 
        title="Saved Questions" 
        description="Organize questions into lists for quick access later." 
      />
      {/* Delete list confirmation */}
      <ConfirmDeleteListModal
        open={deleteListOpen}
        onOpenChange={setDeleteListOpen}
        listName={deleteListName}
        onConfirm={handleConfirmDeleteList}
        loading={deletingList}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <SavedListsSidebar
          listsLoading={listsLoading}
          lists={lists}
          selected={selected}
          onSelectAll={handleSelectAll}
          onSelectList={handleSelectList}
          onCreateList={handleOpenCreateList}
          onDeleteList={handleOpenDeleteList}
        />

        {/* Main content */}
        <SavedQuestionsMain
          headerTitle={headerTitle}
          headerCountLabel={headerCountLabel}
          totalQuestions={totalQuestions}
          selectedType={selected.type}
          searchTerm={searchTerm}
          onChangeSearchTerm={setSearchTerm}
          loading={loading}
          questions={questionsWithActions}
          onSelectQuestion={handleQuestionClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(Math.max(1, p))}
          onRemoveFromList={handleRemoveFromCurrentList}
          removingQuestionId={removingQuestionId}
          onOpenAddToList={handleOpenAddToList}
          onUnsaveQuestion={handleUnsaveQuestion}
          unsavingQuestionId={unsavingQuestionId}
        />
      </div>

      {/* Create list modal */}
      <CreateSavedListModal
        open={createListOpen}
        onOpenChange={setCreateListOpen}
        onCreate={handleCreateList}
      />

      {/* Add to list modal */}
      <AddToSavedListModal
        open={addToListOpen}
        onOpenChange={setAddToListOpen}
        lists={lists}
        onSelectList={handleSelectAddList}
        loading={loadingAddedListIds}
        addedListIds={addedListIds}
        addingToListId={addingToListId}
        onCreateNewList={() => {
          setAddToListOpen(false);
          setReopenAddAfterCreate(true);
          setCreateListOpen(true);
        }}
      />
    </QnaLayout>
  );
}
