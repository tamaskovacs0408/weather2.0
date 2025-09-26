export const formatDate = (fullDate: string): string => {
    const date = new Date(fullDate);
    return date.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };