import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

export const HonorModal = () => {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);
  const [triedToDismiss, setTriedToDismiss] = useState(false);

  // use session
  const { data: sessionData } = useSession();

  console.log("userid: ", sessionData?.user.id);

  let acceptedHonorCode;

  if (sessionData?.user.id) {
    console.log("userid: ", sessionData.user.id);
    acceptedHonorCode = api.userdata.getUserHonorCode.useQuery({
      id: sessionData.user.id,
    });
  }

  console.log(
    "userID",
    sessionData?.user.id,
    "acceptedHonorCode: ",
    acceptedHonorCode?.data?.acceptedHonorCode
  );
  // Get the mutate function from useMutation
  const mutationObj = api.userdata.setUserHonorCode.useMutation();

  return (
    <div>
      {!acceptedHonorCode?.data?.acceptedHonorCode ? (
        <div>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => {
                setTriedToDismiss(true);
              }}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                      <div>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <ClipboardDocumentIcon
                            className="h-6 w-6 text-blue-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Honor Statement
                          </Dialog.Title>
                          <div className="mt-2 flex flex-col items-center justify-center text-sm text-gray-500">
                            <p className="">On my honor,</p>
                            <div className="w-3/4 ">
                              <ul className="list-disc text-left">
                                <li>
                                  I promise to behave in accordance with the{" "}
                                  <a
                                    className="italic text-blue-600 underline"
                                    href="https://vatsim.net/docs/policy/code-of-conduct"
                                  >
                                    VATSIM Code of Conduct
                                  </a>
                                </li>
                                <li>
                                  I promise not to interfere (maliciously or
                                  otherwise) with data I don&apos;t need to
                                  modify.
                                </li>{" "}
                                <li>
                                  I promise to be <b>very careful</b> when
                                  modifying data, knowing that mistakes I make
                                  may cause problems for others.
                                </li>
                                <li>
                                  If I have any questions, I will ask for help
                                  instead of proceeding [TODO:add discord link]
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Checkbox */}

                      <div className="mt-5 sm:mt-6">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-neutral-400"
                          onClick={() => {
                            if (
                              sessionData &&
                              sessionData.user &&
                              sessionData.user.id
                            ) {
                              // Call the mutation function
                              mutationObj.mutate({
                                id: sessionData?.user.id,
                                acceptedHonorCode: true,
                              });
                              setOpen(false);
                            }
                          }}
                          disabled={!checked}
                        >
                          Agree and Continue
                        </button>
                        <div className="mt-2 flex items-center justify-center gap-x-2">
                          {" "}
                          <input
                            id="I have read and agree to the Honor Statement"
                            name="I have read and agree to the Honor Statement"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                            // onClick={() => setChecked(!checked)}
                          />
                          <p className="text-sm">
                            I have read the honor statement
                          </p>
                        </div>
                        {triedToDismiss && (
                          <p className="pt-4 text-center text-sm italic text-red-500">
                            You must Agree and Continue to use this page
                          </p>
                        )}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      ) : null}
    </div>
  );
};
