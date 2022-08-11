import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import React from "react";
import { z } from "zod";
import { DeleteButton, ErrorMessage, PrimaryButton } from "~/components/forms";
import { PlusIcon, SaveIcon, SearchIcon } from "~/components/icons";
import {
  createShelf,
  deleteShelf,
  getAllShelves,
  saveShelfName,
} from "~/models/pantry-shelf.server";
import { classNames } from "~/utils/misc";
import { validateForm } from "~/utils/validation";

type LoaderData = {
  shelves: Awaited<ReturnType<typeof getAllShelves>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const shelves = await getAllShelves(q);
  return json({ shelves });
};

const deleteShelfSchema = z.object({
  shelfId: z.string(),
});

const saveShelfNameSchema = z.object({
  shelfId: z.string(),
  shelfName: z.string().min(1, "Shelf name cannot be blank"),
});

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  switch (formData.get("_action")) {
    case "createShelf": {
      return createShelf();
    }
    case "deleteShelf": {
      return validateForm(
        formData,
        deleteShelfSchema,
        (data) => deleteShelf(data.shelfId),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "saveShelfName": {
      return validateForm(
        formData,
        saveShelfNameSchema,
        (data) => saveShelfName(data.shelfId, data.shelfName),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    default: {
      return null;
    }
  }
};

export default function Pantry() {
  const data = useLoaderData() as LoaderData;
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  const createShelfFetcher = useFetcher();
  const containerRef = React.useRef<HTMLUListElement>(null);

  const isSearching = transition.submission?.formData.has("q");
  const isCreatingShelf =
    createShelfFetcher.submission?.formData.get("_action") === "createShelf";

  React.useEffect(() => {
    if (!isCreatingShelf && containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
  }, [isCreatingShelf]);

  return (
    <div>
      <Form
        className={classNames(
          "flex border-2 border-gray-300 rounded-md",
          "focus-within:border-primary md:w-80",
          isSearching ? "animate-pulse" : ""
        )}
      >
        <button className="px-2 mr-1">
          <SearchIcon />
        </button>
        <input
          defaultValue={searchParams.get("q") ?? ""}
          type="text"
          name="q"
          autoComplete="off"
          placeholder="Search Shelves..."
          className="w-full py-3 px-2 outline-none"
        />
      </Form>
      <createShelfFetcher.Form method="post">
        <PrimaryButton
          name="_action"
          value="createShelf"
          className="mt-4 w-full md:w-fit"
          isLoading={isCreatingShelf}
        >
          <PlusIcon />
          <span className="pl-2">
            {isCreatingShelf ? "Creating Shelf" : "Create Shelf"}
          </span>
        </PrimaryButton>
      </createShelfFetcher.Form>
      <ul
        ref={containerRef}
        className={classNames(
          "flex gap-8 overflow-x-auto mt-4 pb-4",
          "snap-x snap-mandatory md:snap-none"
        )}
      >
        {data.shelves.map((shelf) => (
          <Shelf key={shelf.id} shelf={shelf} />
        ))}
      </ul>
    </div>
  );
}

type ShelfProps = {
  shelf: LoaderData["shelves"][number];
};
function Shelf({ shelf }: ShelfProps) {
  const deleteShelfFetcher = useFetcher();
  const saveShelfNameFetcher = useFetcher();
  const isDeletingShelf =
    deleteShelfFetcher.submission?.formData.get("_action") === "deleteShelf" &&
    deleteShelfFetcher.submission?.formData.get("shelfId") === shelf.id;
  return isDeletingShelf ? null : (
    <li
      key={shelf.id}
      className={classNames(
        "border-2 border-primary rounded-md p-4 h-fit",
        "w-[calc(100vw-2rem)] flex-none snap-center",
        "md:w-96"
      )}
    >
      <saveShelfNameFetcher.Form method="post" className="flex">
        <div className="w-full mb-2">
          <input
            type="text"
            defaultValue={shelf.name}
            name="shelfName"
            placeholder="Shelf Name"
            autoComplete="off"
            className={classNames(
              "text-2xl font-extrabold w-full outline-none",
              "border-b-2 border-b-background focus:border-b-primary",
              saveShelfNameFetcher.data?.errors?.shelfName
                ? "border-b-red-600"
                : ""
            )}
          />
          <ErrorMessage>
            {saveShelfNameFetcher.data?.errors?.shelfName}
          </ErrorMessage>
        </div>
        <button name="_action" value="saveShelfName" className="ml-4">
          <SaveIcon />
        </button>
        <input type="hidden" name="shelfId" value={shelf.id} />
        <ErrorMessage className="pl-2">
          {saveShelfNameFetcher.data?.errors?.shelfId}
        </ErrorMessage>
      </saveShelfNameFetcher.Form>
      <ul>
        {shelf.items.map((item) => (
          <li key={item.id} className="py-2">
            {item.name}
          </li>
        ))}
      </ul>
      <deleteShelfFetcher.Form method="post" className="pt-8">
        <input type="hidden" name="shelfId" value={shelf.id} />
        <ErrorMessage className="pb-2">
          {deleteShelfFetcher.data?.errors?.shelfId}
        </ErrorMessage>
        <DeleteButton className="w-full" name="_action" value="deleteShelf">
          Delete Shelf
        </DeleteButton>
      </deleteShelfFetcher.Form>
    </li>
  );
}
