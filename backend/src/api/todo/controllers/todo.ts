/**
 * todo controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::todo.todo', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const todos = await strapi.documents('api::todo.todo').findMany({
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.id,
          },
        },
      },
      sort: {
        createdAt: 'desc',
      },
      status: 'published',
    });

    const sanitizedTodos = await this.sanitizeOutput(todos, ctx);

    return this.transformResponse(sanitizedTodos);
  },

  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const data = ctx.request.body?.data || {};
    const title = typeof data.title === 'string' ? data.title.trim() : '';

    if (!title) {
      return ctx.badRequest('Title is required');
    }

    const todo = await strapi.documents('api::todo.todo').create({
      data: {
        title,
        isCollection: Boolean(data.isCollection),
        isCompleted: false,
        users_permissions_user: user.id,
      },
      status: 'published',
    });

    const sanitizedTodo = await this.sanitizeOutput(todo, ctx);

    return this.transformResponse(sanitizedTodo);
  },

  async update(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const documentId = ctx.params.documentId || ctx.params.id;
    const data = ctx.request.body?.data || {};

    const existingTodo = await strapi.documents('api::todo.todo').findFirst({
      filters: {
        documentId: {
          $eq: documentId,
        },
        users_permissions_user: {
          id: {
            $eq: user.id,
          },
        },
      },
      status: 'published',
    });

    if (!existingTodo) {
      return ctx.notFound('Todo not found');
    }

    const todo = await strapi.documents('api::todo.todo').update({
      documentId,
      data: {
        isCompleted: Boolean(data.isCompleted),
      },
      status: 'published',
    });

    const sanitizedTodo = await this.sanitizeOutput(todo, ctx);

    return this.transformResponse(sanitizedTodo);
  },

  async delete(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const documentId = ctx.params.documentId || ctx.params.id;

    const existingTodo = await strapi.documents('api::todo.todo').findFirst({
      filters: {
        documentId: {
          $eq: documentId,
        },
        users_permissions_user: {
          id: {
            $eq: user.id,
          },
        },
      },
      status: 'published',
    });

    if (!existingTodo) {
      return ctx.notFound('Todo not found');
    }

    const todo = await strapi.documents('api::todo.todo').delete({
      documentId,
    });

    const sanitizedTodo = await this.sanitizeOutput(todo, ctx);

    return this.transformResponse(sanitizedTodo);
  },
}));
