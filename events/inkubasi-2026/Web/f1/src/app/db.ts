export const db = {
  createConnection: (key: string) => ({
    createUser: async (name: any) => ({
      id: "user123",
      secret: key
    })
  })
};
