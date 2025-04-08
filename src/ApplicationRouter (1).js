// ./src/ApplicationRouter.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from 'pages/Public/IndexPage';
import HomePage from 'pages/Public/HomePage';
import HelloWorld from 'pages/Public/HelloWorld';
import ActivateAccountPage from 'pages/Auth/ActivateAccountPage';
import ForgotPasswordPage from 'pages/Auth/ForgotPasswordPage';
import LoginPage from 'pages/Auth/LoginPage';
import RegisterPage from 'pages/Auth/RegisterPage';
import ResendActivationPage from 'pages/Auth/ResendActivationPage';
import ResetPasswordPage from 'pages/Auth/ResetPasswordPage';
import DashboardSwitcher from 'pages/Dashboard/DashboardSwitcher';
import PlanPage from 'pages/Plan/PlanPage';
import SubscribePlanPage from 'pages/Plan/SubscribePlanPage';
import IndexTeamsPage from 'pages/Teams/IndexTeamsPage';
import TeamPage from 'pages/Teams/TeamPage';
import UserTeams from 'pages/Teams/UserTeams';
import CardAddPage from 'pages/User/CardAddPage';
import EditAccountPage from 'pages/User/EditAccountPage';
import EditUserPage from 'pages/User/EditUserPage';
import CreateUsersPage from 'pages/Users/CreateUsersPage';
import EditUser from 'pages/Users/EditUser';
import EditUsersPage from 'pages/Users/EditUsersPage';
import IndexUsersPage from 'pages/Users/IndexUsersPage';
import SubscriberPage from 'pages/Users/SubscriberPage';
import { PrivateRoute } from 'routes/PrivateRoute';
import { PrivateActiveRoute } from 'routes/PrivateActiveRoute';
import { OnlyPublicRoute } from 'routes/OnlyPublicRoute';
import AuthLayout from 'layouts/AuthLayout';
import PrivateLayout from 'layouts/PrivateLayout';
import PublicLayout from 'layouts/PublicLayout';
import SnackbarOpen from './SnackbarOpen';
import { DarkMode } from 'contexts/DarkMode';
import { ScrolledProvider } from 'contexts/ScrolledContext';
import { DashboardDrawerProtectedProvider } from 'contexts/DashboardDrawerProtectedContext';
import { DashboardDrawerProvider } from 'contexts/DashboardDrawerContext';
import { DrawerProvider } from 'contexts/DrawerContext';
import { TvMode } from 'contexts/TvMode';
import { WorkspaceProvider } from 'contexts/WorkspaceContext';
import { AccordionProvider } from 'contexts/AccordionContext';
import { AuthProvider } from 'contexts/AuthContext';
import { SlideProvider } from 'contexts/SlideContext';
import { RolesProvider } from 'contexts/RolesContext';
import { PlanTypeProvider } from 'contexts/PlanTypeContext';
import { MenuProvider } from 'contexts/MenuContext';
import { ChatsProvider } from 'contexts/ChatsContext';
import './App.css';
import './Fonts.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const ApplicationRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TvMode>
        <ChatsProvider>
          <WorkspaceProvider>
            <AuthProvider>
              <SlideProvider>
                <AccordionProvider>
                  <MenuProvider>
                    <ScrolledProvider>
                      <DashboardDrawerProtectedProvider>
                        <DashboardDrawerProvider>
                          <DrawerProvider>
                            <DarkMode>
                              <Router>
                                <Routes>
                                  <Route
                                    path="/"
                                    element={
                                      <IndexPage />
                                    }
                                  />
                                  <Route
                                    path="/hello-world"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PublicLayout>
                                            <SnackbarOpen>
                                              <HelloWorld />
                                            </SnackbarOpen>
                                          </PublicLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/home-page"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PublicLayout>
                                            <SnackbarOpen>
                                              <HomePage />
                                            </SnackbarOpen>
                                          </PublicLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/auth/login"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <AuthLayout>
                                            <SnackbarOpen>
                                              <OnlyPublicRoute element={LoginPage} />
                                            </SnackbarOpen>
                                          </AuthLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/auth/forgot-password"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <AuthLayout>
                                            <SnackbarOpen>
                                              <OnlyPublicRoute element={ForgotPasswordPage} />
                                            </SnackbarOpen>
                                          </AuthLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/auth/resend-activation"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <AuthLayout>
                                            <SnackbarOpen>
                                              <OnlyPublicRoute element={ResendActivationPage} />
                                            </SnackbarOpen>
                                          </AuthLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/auth/reset-password/:email"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <AuthLayout>
                                            <SnackbarOpen>
                                              <OnlyPublicRoute element={ResetPasswordPage} />
                                            </SnackbarOpen>
                                          </AuthLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/auth/activate/:email"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <AuthLayout>
                                            <SnackbarOpen>
                                              <OnlyPublicRoute element={ActivateAccountPage} />
                                            </SnackbarOpen>
                                          </AuthLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/auth/register"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <AuthLayout>
                                            <SnackbarOpen>
                                              <OnlyPublicRoute element={RegisterPage} />
                                            </SnackbarOpen>
                                          </AuthLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/dashboard"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateActiveRoute element={DashboardSwitcher} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/teams"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateActiveRoute element={IndexTeamsPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/teams/:teamId"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateActiveRoute element={TeamPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/user-teams"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateActiveRoute element={UserTeams} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/card/add"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateActiveRoute element={CardAddPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/subscribers"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateActiveRoute element={SubscriberPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/plan/:planId/subscribe"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={SubscribePlanPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/plan"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={PlanPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/user/edit"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={EditUserPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/account/edit"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={EditAccountPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/users"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={IndexUsersPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/create-user"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={CreateUsersPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/edit-user/:userId"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={EditUsersPage} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                  <Route
                                    path="/user/:userId"
                                    element={
                                      <RolesProvider>
                                        <PlanTypeProvider>
                                          <PrivateLayout>
                                            <SnackbarOpen>
                                              <PrivateRoute element={EditUser} />
                                            </SnackbarOpen>
                                          </PrivateLayout>
                                        </PlanTypeProvider>
                                      </RolesProvider>
                                    }
                                  />
                                </Routes>
                              </Router>
                            </DarkMode>
                          </DrawerProvider>
                        </DashboardDrawerProvider>
                      </DashboardDrawerProtectedProvider>
                    </ScrolledProvider>
                  </MenuProvider>
                </AccordionProvider>
              </SlideProvider>
            </AuthProvider>
          </WorkspaceProvider>
        </ChatsProvider>
      </TvMode>
    </QueryClientProvider>
  );
};

export default ApplicationRouter;