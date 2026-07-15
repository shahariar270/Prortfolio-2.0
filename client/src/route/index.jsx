import { Editorial } from "@Pages/Editorial";
import { NotFound } from "@Pages/NotFound";
import { createBrowserRouter } from "react-router-dom";


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
        path: '*',
        element: <NotFound />
    }
])
