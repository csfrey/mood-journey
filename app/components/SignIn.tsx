"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="my-auto p-2 rounded-lg bg-blue-400 hover:bg-blue-500">
          Sign in
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1 font-sans">
          <MenuItem>
            <button
              onClick={() => signIn("google")}
              className="flex block w-full px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              <div className="my-auto mr-2">
                <FcGoogle />
              </div>
              <div>Login with Google</div>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => signIn("github")}
              className="flex block w-full px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              <div className="my-auto mr-2">
                <FaGithub />
              </div>
              <div>Login with GitHub</div>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default SignIn;
