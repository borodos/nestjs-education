import { Prisma } from '../../../../generated/prisma/client.js';

export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    user: {
      async findMany({ args, query }) {
        args.where = { deleted_at: null, ...args.where };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { deleted_at: null, ...args.where };
        return query(args);
      },
      async count({ args, query }) {
        args.where = { deleted_at: null, ...args.where };
        return query(args);
      },
    },
  },
});
