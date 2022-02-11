import { Link } from "solid-app-router";
import { Component } from "solid-js";

type NotFoundProps = {};
const NotFound: Component<NotFoundProps> = (props) => {
  return (
    <div class="px-5 absolute flex items-center justify-center w-full h-full bg-gradient-to-r from-indigo-600 to-blue-400">
      <div class="p-10 bg-white rounded-md shadow-xl">
        <div class="flex flex-col items-center">
          <h1 class="font-bold text-blue-600 text-9xl">404</h1>
          <h6 class="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
            <span class="text-red-500">Oops!</span> Page not found
          </h6>
          <p class="mb-8 text-center text-gray-500 md:text-lg">
            The page you’re looking for doesn’t exist.
          </p>
          <Link
            href="/"
            class="px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100"
          >
            Back to Daily Quordle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
