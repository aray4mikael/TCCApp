export let globalUID: string | null = null;

export const setGlobalUID = (uid: string) => {
  globalUID = uid;
  console.log("UID do usuário:", globalUID);
};

export const getGlobalUID = () => {
  return globalUID;
};
