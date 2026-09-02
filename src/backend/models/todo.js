class TodoModel {
  constructor(database) {
    this.database = database;
    this.createStatement = database.prepare(`
      INSERT INTO todos (user_id, title, description, is_public)
      VALUES (@userId, @title, @description, @isPublic)
    `);
    this.findByIdStatement = database.prepare(`
      SELECT id, user_id AS userId, title, description,
             is_public AS isPublic, created_at AS createdAt, updated_at AS updatedAt
      FROM todos WHERE id = ?
    `);
    this.findVisibleStatement = database.prepare(`
      SELECT id, user_id AS userId, title, description,
             is_public AS isPublic, created_at AS createdAt, updated_at AS updatedAt
      FROM todos
      WHERE user_id = ? OR is_public = 1
      ORDER BY created_at DESC, id DESC
    `);
    this.findPublicStatement = database.prepare(`
      SELECT id, user_id AS userId, title, description,
             is_public AS isPublic, created_at AS createdAt, updated_at AS updatedAt
      FROM todos WHERE is_public = 1
      ORDER BY created_at DESC, id DESC
    `);
    this.updateStatement = database.prepare(`
      UPDATE todos
      SET title = @title, description = @description, is_public = @isPublic,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = @id AND user_id = @userId
    `);
    this.deleteStatement = database.prepare(
      'DELETE FROM todos WHERE id = @id AND user_id = @userId'
    );
  }

  toApiTodo(todo) {
    return todo ? { ...todo, isPublic: Boolean(todo.isPublic) } : null;
  }

  create({ userId, title, description, isPublic }) {
    const result = this.createStatement.run({ userId, title, description, isPublic: isPublic ? 1 : 0 });
    return this.toApiTodo(this.findById(result.lastInsertRowid));
  }

  findById(id) {
    return this.toApiTodo(this.findByIdStatement.get(id));
  }

  findVisibleToUser(userId) {
    return this.findVisibleStatement.all(userId).map((todo) => this.toApiTodo(todo));
  }

  findPublic() {
    return this.findPublicStatement.all().map((todo) => this.toApiTodo(todo));
  }

  update({ id, userId, title, description, isPublic }) {
    const result = this.updateStatement.run({
      id,
      userId,
      title,
      description,
      isPublic: isPublic ? 1 : 0
    });
    return result.changes ? this.findById(id) : null;
  }

  delete({ id, userId }) {
    return this.deleteStatement.run({ id, userId }).changes > 0;
  }
}

module.exports = { TodoModel };
