function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validateTodo(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = body.description === undefined || body.description === null
    ? ''
    : typeof body.description === 'string' ? body.description.trim() : null;

  if (!title || title.length > 255) {
    return { error: 'Title is required and must be at most 255 characters' };
  }
  if (description === null || description.length > 5000) {
    return { error: 'Description must be a string of at most 5000 characters' };
  }
  if (body.isPublic !== undefined && typeof body.isPublic !== 'boolean') {
    return { error: 'isPublic must be a boolean' };
  }
  return { title, description, isPublic: body.isPublic === true };
}

function createTodoController({ todoModel }) {
  return {
    list(request, response) {
      return response.json({ todos: todoModel.findVisibleToUser(request.user.id) });
    },

    listPublic(request, response) {
      return response.json({ todos: todoModel.findPublic() });
    },

    get(request, response) {
      const id = parseId(request.params.id);
      const todo = id ? todoModel.findById(id) : null;
      if (!todo || (todo.userId !== request.user?.id && !todo.isPublic)) {
        return response.status(404).json({ error: 'Todo not found' });
      }
      return response.json({ todo });
    },

    create(request, response) {
      const values = validateTodo(request.body || {});
      if (values.error) return response.status(400).json({ error: values.error });

      const todo = todoModel.create({ ...values, userId: request.user.id });
      return response.status(201).json({ todo });
    },

    update(request, response) {
      const id = parseId(request.params.id);
      if (!id) return response.status(404).json({ error: 'Todo not found' });

      const values = validateTodo(request.body || {});
      if (values.error) return response.status(400).json({ error: values.error });

      const todo = todoModel.update({ ...values, id, userId: request.user.id });
      if (!todo) return response.status(404).json({ error: 'Todo not found' });
      return response.json({ todo });
    },

    remove(request, response) {
      const id = parseId(request.params.id);
      if (!id || !todoModel.delete({ id, userId: request.user.id })) {
        return response.status(404).json({ error: 'Todo not found' });
      }
      return response.status(204).send();
    }
  };
}

module.exports = { createTodoController, parseId, validateTodo };
