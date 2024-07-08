class Model {
  static TABLE_NAME = "duties";
  static PRIMARY_KEY = "id";

  static TABLE_COLUMN_MAP = {
    ID: "id",
    NAME: "name",
  };

  static get tableName() {
    return this.TABLE_NAME;
  }

  static get idColumn() {
    return this.PRIMARY_KEY;
  }
}

export { Model };
