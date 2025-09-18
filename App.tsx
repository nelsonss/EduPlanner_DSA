import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { LearningPage } from './pages/LearningPage';
import { LabPage } from './pages/LabPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { CompetePage } from './pages/CompetePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { SkillProvider } from './contexts/SkillContext';
import { UserProvider } from './contexts/UserContext';

// Search Context for the search bar in the Header
interface SearchContextType {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};


const App: React.FC = () => {
    return (
        <ThemeProvider>
            <SkillProvider>
                <UserProvider>
                    <SearchProvider>
                        <Router>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/learn" element={<LearningPage />} />
                                    <Route path="/lab" element={<LabPage />} />
                                    <Route path="/evaluate" element={<EvaluationPage />} />
                                    <Route path="/compete" element={<CompetePage />} />
                                    <Route path="/projects" element={<ProjectsPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="/teacher" element={<TeacherDashboardPage />} />
                                </Routes>
                            </Layout>
                        </Router>
                    </SearchProvider>
                </UserProvider>
            </SkillProvider>
        </ThemeProvider>
    );
};

export default App;