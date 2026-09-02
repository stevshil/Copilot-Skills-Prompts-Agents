class UserModel {
  constructor(database) {
    this.database = database;
    this.insertStatement = database.prepare(
      'INSERT INTO users (email, password_hash) VALUES (@email, @passwordHash)'
    );
    this.findByEmailStatement = database.prepare(
      'SELECT id, email, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE email = ?'
    );
    this.findByIdStatement = database.prepare(
      'SELECT id, email, created_at AS createdAt FROM users WHERE id = ?'
    );
  }

  create({ email, passwordHash }) {
    const result = this.insertStatement.run({ email, passwordHash });
    return this.findById(result.lastInsertRowid);
  }

  findByEmail(email) {
    return this.findByEmailStatement.get(email);
  }

  findById(id) {
    return this.findByIdStatement.get(id);
  }
}

module.exports = { UserModel };
