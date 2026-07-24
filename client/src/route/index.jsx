import { Admin, AdminAnalytics, AdminPosts, AdminSkills, AdminProjects, AdminTaxonomy } from "@Pages/Admin";
import { Editorial } from "@Pages/Editorial";
import { NotFound } from "@Pages/NotFound";
import { createBrowserRouter, Navigate } from "react-router-dom";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Editorial />
    },
    {
        path: '/about',
        element: <Editorial section="sec-about" />
    },
    {
        path: '/skill',
        element: <Editorial section="sec-skill" />
    },
    {
        path: '/project',
        element: <Editorial section="sec-project" />
    },
    {
        path: '/blog',
        element: <Editorial section="sec-blog" />
    },
    {
        path: '/blog/:title',
        element: <Editorial section="sec-blog" />
    },
    {
        path: '/contact',
        element: <Editorial section="sec-contact" />
    },
    {
        path: '/st-admin',
        element: <Admin />,
        children: [
            { index: true, element: <Navigate to="/st-admin/analytics" replace /> },
            { path: 'analytics', element: <AdminAnalytics /> },
            { path: 'posts', element: <AdminPosts /> },
            { path: 'skills', element: <AdminSkills /> },
            { path: 'projects', element: <AdminProjects /> },
            { path: 'taxonomy', element: <AdminTaxonomy /> },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])
