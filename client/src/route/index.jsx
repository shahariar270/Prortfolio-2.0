import { Editorial } from "@Pages/Editorial";
import { NotFound } from "@Pages/NotFound";
import { BlogDetails } from "@Pages/Blog/Details";
import { ProjectDetails } from "@Pages/Project/Details";
import { createBrowserRouter, Navigate } from "react-router-dom";

// The admin panel (and its rich-text editor dependency) is only ever used
// by the site owner — lazy-load it via route.lazy so public visitors never
// pull its bundle weight into the portfolio pages.
const adminExport = (name) => async () => {
    const admin = await import("@Pages/Admin");
    return { Component: admin[name] };
};

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
        path: '/project/:slug',
        element: <ProjectDetails />
    },
    {
        path: '/blog',
        element: <Editorial section="sec-blog" />
    },
    {
        path: '/blog/:slug',
        element: <BlogDetails />
    },
    {
        path: '/contact',
        element: <Editorial section="sec-contact" />
    },
    {
        path: '/st-admin',
        lazy: adminExport('Admin'),
        children: [
            { index: true, element: <Navigate to="/st-admin/analytics" replace /> },
            { path: 'analytics', lazy: adminExport('AdminAnalytics') },
            { path: 'posts', lazy: adminExport('AdminPosts') },
            { path: 'skills', lazy: adminExport('AdminSkills') },
            { path: 'projects', lazy: adminExport('AdminProjects') },
            { path: 'taxonomy', lazy: adminExport('AdminTaxonomy') },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])
