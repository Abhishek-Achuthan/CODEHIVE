import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { QnAService } from "../../../services/qnaService";
import type { QuestionListParams } from "../../../shared/types/api/qna";
import { BaseError } from "../../../shared/errors/BaseError";
import type { QuestionListItemView } from "../../../shared/types/view/QuestionListItemView";
import type { SavedListView } from "../../../shared/types/view/SavedListView";
import { mapQuestionListItemToView } from "../../../shared/mappers/question.mapper";
import { mapSavedListArrayToView } from "../../../shared/mappers/saved-list.mapper";

const LIMIT = 5;

export type SelectedTab =
  | { type: "all" }
  | { type: "list"; listId: string; name: string };

export function useSavedQuestionsPage() {
  const [lists, setLists] = useState<SavedListView[]>([]);
  const [listsLoading, setListsLoading] = useState(false);

  const [selected, setSelected] = useState<SelectedTab>({ type: "all" });

  const [questions, setQuestions] = useState<QuestionListItemView[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [createListOpen, setCreateListOpen] = useState(false);
  const [addToListOpen, setAddToListOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [reopenAddAfterCreate, setReopenAddAfterCreate] = useState(false);

  const [addedListIds, setAddedListIds] = useState<string[]>([]);
  const [loadingAddedListIds, setLoadingAddedListIds] = useState(false);
  const [addingToListId, setAddingToListId] = useState<string | null>(null);
  const [removingQuestionId, setRemovingQuestionId] = useState<string | null>(null);
  const [unsavingQuestionId, setUnsavingQuestionId] = useState<string | null>(null);

  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [deleteListName, setDeleteListName] = useState<string>("");
  const [deletingList, setDeletingList] = useState(false);

  const totalPages = Math.ceil(totalQuestions / LIMIT);

  const headerTitle = useMemo(() => {
    if (selected.type === "all") return "Saved Questions";
    return selected.name;
  }, [selected]);

  const headerCountLabel = useMemo(() => {
    if (selected.type === "all") return "saved item";
    return "saved item";
  }, [selected]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setListsLoading(true);
        const res = await QnAService.listSavedLists();
        if (!cancelled) setLists(mapSavedListArrayToView(res));
      } catch {
        toast.error("Failed to load saved lists");
      } finally {
        if (!cancelled) setListsLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshLists = async () => {
    const res = await QnAService.listSavedLists();
    setLists(mapSavedListArrayToView(res));
  };

  const refreshAddedListIds = async (questionId: string) => {
    try {
      setLoadingAddedListIds(true);
      const res = await QnAService.getSavedListIdsForQuestion(questionId);
      setAddedListIds(Array.isArray(res?.listIds) ? res.listIds : []);
    } catch {
      setAddedListIds([]);
    } finally {
      setLoadingAddedListIds(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);

        const params: QuestionListParams = {
          page: currentPage,
          limit: LIMIT,
          sortBy: "newest",
          search: searchTerm.trim() || undefined,
        };

        const res =
          selected.type === "all"
            ? await QnAService.listSavedQuestions(params)
            : await QnAService.listSavedListQuestions(selected.listId, params);

        if (cancelled) return;

        const items = Array.isArray(res?.items) ? res.items.map(mapQuestionListItemToView) : [];
        setQuestions(items);
        setTotalQuestions(typeof res?.totalItems === "number" ? res.totalItems : 0);
      } catch {
        if (!cancelled) {
          toast.error("Failed to load saved questions");
          setQuestions([]);
          setTotalQuestions(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [currentPage, searchTerm, selected]);

  const handleOpenCreateList = () => {
    setCreateListOpen(true);
  };

  const handleCreateList = async (name: string) => {
    try {
      const created = await QnAService.createSavedList({ name });
      if (created?.id) {
        await refreshLists();
        setSelected({ type: "list", listId: created.id, name: created.name });
        setCurrentPage(1);

        if (reopenAddAfterCreate && activeQuestionId) {
          setReopenAddAfterCreate(false);
          await refreshAddedListIds(activeQuestionId);
          setAddToListOpen(true);
        }
      }
    } catch {
      toast.error("Failed to create list");
      throw new BaseError("Failed to create list");
    }
  };

  const handleOpenAddToList = (questionId: string) => {
    setActiveQuestionId(questionId);
    setAddToListOpen(true);
    void refreshAddedListIds(questionId);
  };

  const handleSelectAddList = async (listId: string) => {
    if (!activeQuestionId) return;

    try {
      setAddingToListId(listId);
      await QnAService.addQuestionToSavedList(listId, activeQuestionId);
      toast.success("Added to list");
      await refreshAddedListIds(activeQuestionId);
      setAddToListOpen(false);
    } catch {
      toast.error("Failed to add to list");
    } finally {
      setAddingToListId(null);
    }
  };

  const handleRemoveFromCurrentList = async (questionId: string) => {
    if (selected.type !== "list") return;

    try {
      setRemovingQuestionId(questionId);
      await QnAService.removeQuestionFromSavedList(selected.listId, questionId);
      toast.success("Removed from list");

      const params: QuestionListParams = {
        page: currentPage,
        limit: LIMIT,
        sortBy: "newest",
        search: searchTerm.trim() || undefined,
      };

      const res = await QnAService.listSavedListQuestions(selected.listId, params);
      const items = Array.isArray(res?.items) ? res.items.map(mapQuestionListItemToView) : [];
      setQuestions(items);
      setTotalQuestions(typeof res?.totalItems === "number" ? res.totalItems : 0);
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to remove from list");
      }
    } finally {
      setRemovingQuestionId(null);
    }
  };

  const handleSelectAll = () => {
    setSelected({ type: "all" });
    setCurrentPage(1);
  };

  const handleSelectList = (l: SavedListView) => {
    setSelected({ type: "list", listId: l.id, name: l.name });
    setCurrentPage(1);
  };

  const handleOpenDeleteList = (l: SavedListView) => {
    setDeleteListId(l.id);
    setDeleteListName(l.name);
    setDeleteListOpen(true);
  };

  const handleConfirmDeleteList = async () => {
    if (!deleteListId) return;

    try {
      setDeletingList(true);
      await QnAService.deleteSavedList(deleteListId);
      toast.success("List deleted");

      await refreshLists();

      if (selected.type === "list" && selected.listId === deleteListId) {
        setSelected({ type: "all" });
        setCurrentPage(1);
      }

      setDeleteListOpen(false);
      setDeleteListId(null);
      setDeleteListName("");
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete list");
      }
    } finally {
      setDeletingList(false);
    }
  };

  const handleUnsaveQuestion = async (questionId: string) => {
    try {
      setUnsavingQuestionId(questionId);
      await QnAService.unsaveQuestion(questionId);
      toast.success("Question unsaved");

      const params: QuestionListParams = {
        page: currentPage,
        limit: LIMIT,
        sortBy: "newest",
        search: searchTerm.trim() || undefined,
      };

      const res = await QnAService.listSavedQuestions(params);
      const items = Array.isArray(res?.items) ? res.items.map(mapQuestionListItemToView) : [];
      setQuestions(items);
      setTotalQuestions(typeof res?.totalItems === "number" ? res.totalItems : 0);
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to unsave question");
      }
    } finally {
      setUnsavingQuestionId(null);
    }
  };

  return {
    LIMIT,

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
    activeQuestionId,
    handleOpenAddToList,
    handleSelectAddList,

    reopenAddAfterCreate,
    setReopenAddAfterCreate,

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
  };
}
