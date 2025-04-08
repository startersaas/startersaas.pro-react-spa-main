// api/queries.js
import Axios from "libs/axios";

const Me = async (key) => {
  const result = await Axios.authenticated().get("/users/me?withAccount=true");
  return result;
};

const Account = async (accountId) => {
  const result = await Axios.authenticated().get(`/accounts/${accountId}`);
  return result;
};

const Customer = async () => {
  const result = await Axios.authenticated().get("/stripe/customers/me");
  return result;
};

const CustomerInvoices = async () => {
  const result = await Axios.authenticated().get(
    "/stripe/customers/me/invoices"
  );
  return result;
};

const CustomerCards = async () => {
  const result = await Axios.authenticated().get("/stripe/customers/me/cards");
  return result;
};

const Plans = async () => {
  const result = await Axios.base().get("/stripe/plans");
  return result;
};

const Users = async () => {
  const result = await Axios.authenticated().get("/users/");
  return result;
};

const User = async (userId) => {
  const result = await Axios.authenticated().get(`/users/${userId}`);
  return result;
};

const Teams = async () => {
  const result = await Axios.authenticated().get("/teams");
  return result;
};

const Team = async (id) => {
  const result = await Axios.authenticated().get(`teams/${id}`);
  return result;
};

// New Workspace queries
const Workspaces = async () => {
  const result = await Axios.authenticated().get("/workspaces");
  return result;
};

const Workspace = async (id) => {
  const result = await Axios.authenticated().get(`/workspaces/${id}`);
  return result;
};

const WorkspaceTablesList = async (id) => {
  const result = await Axios.authenticated().get(`/workspaces/${id}/db/tables`);
  return result;
};

const WorkspaceTableData = async (id, limit) => {
  const result = await Axios.authenticated().get(`/workspaces/${id}/db/data${limit ? `?limit=${limit}` : ''}`);
  return result;
};

const TestDatabaseConnection = async (id) => {
  const result = await Axios.authenticated().get(`/workspaces/${id}/db/test`);
  return result;
};

export {
  Me,
  Account,
  Customer,
  CustomerInvoices,
  CustomerCards,
  Plans,
  Users,
  User,
  Teams,
  Team,
  Workspaces,
  Workspace,
  WorkspaceTablesList,
  WorkspaceTableData,
  TestDatabaseConnection,
};