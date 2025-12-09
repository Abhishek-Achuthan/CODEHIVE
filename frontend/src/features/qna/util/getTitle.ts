export function getTitle(activeFilter: string): string {
  switch (activeFilter) {
    case "newest":
      return "Newest Questions";
    case "answered":
      return "Answered Questions";
    case "unanswered":
      return "Unanswered Questions";
    case "most-answered":
      return "Most Answered Questions";
    case "most-voted":
      return "Most Voted Questions";
    case "most-viewed":
      return "Most Viewed Questions";
    case "filter":
      return "Filtered Questions";
    default:
      return "Questions";
  }
}