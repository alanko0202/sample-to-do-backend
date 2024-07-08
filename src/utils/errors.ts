class InvalidOrderError extends Error {
  constructor() {
    super();
    this.message = "Invalid order. order can only be one of asc|desc|ASC|DESC";
  }
}
class InvalidSortError extends Error {
  constructor() {
    super();
    this.message = "Invalid sort parameter. Expected a sort object";
  }
}

export { InvalidOrderError, InvalidSortError };
