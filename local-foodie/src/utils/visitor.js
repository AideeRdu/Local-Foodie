export function getVisitorId() {
  let id = localStorage.getItem("localFoodieVisitorId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("localFoodieVisitorId", id);
  }

  return id;
}