import classNames from "classnames";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import {
  createShelf,
  deleteShelf,
  getAllShelves,
  saveShelfName,
} from "~/models/pantry-shelf.server";
import { Route } from "./+types/pantry";
import { PlusIcon, SaveIcon, SearchIcon } from "~/components/icons";
import { DeleteButton, PrimaryButton } from "~/components/form";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const shelves = await getAllShelves(q);
  return { shelves };
}

type FieldErrors = { [key: string]: string };

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  switch (formData.get("_action")) {
    case "createShelf": {
      return createShelf();
    }
    case "deleteShelf": {
      const shelfId = formData.get("shelfId");
      if (typeof shelfId !== "string") {
        return { errors: { shelfId: "Shelf ID must be a string" } };
      }
      return deleteShelf(shelfId);
    }
    case "saveShelfName": {
      const shelfId = formData.get("shelfId");
      const shelfName = formData.get("shelfName");
      const errors: FieldErrors = {};
      if (
        typeof shelfId === "string" &&
        typeof shelfName === "string" &&
        shelfName !== ""
      ) {
        return saveShelfName(shelfId, shelfName);
      }
      if (typeof shelfName !== "string") {
        errors["shelfName"] = "Shelf name must be a string";
      }
      if (shelfName === "") {
        errors["shelfName"] = "Shelf name cannot be blank";
      }
      if (typeof shelfId !== "string") {
        errors["shelfId"] = "Shelf ID must be a string";
      }
      return { errors };
    }
    default: {
      return null;
    }
  }
}

export default function Pantry() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const createShelfFetcher = useFetcher();
  const navigation = useNavigation();

  const isSearching = navigation.formData?.has("q");
  const isCreatingShelf =
    createShelfFetcher.formData?.get("_action") === "createShelf";

  return (
    <div>
      <Form
        className={classNames(
          "flex border-2 border-gray-300 rounded-md",
          "focus-within:border-primary md:w-80",
          { "animate-pulse": isSearching }
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
          className="w-full py-3 px-2 outline-none rounded-md"
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
  shelf: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
    }[];
  };
};
function Shelf({ shelf }: ShelfProps) {
  const deleteShelfFetcher = useFetcher();
  const saveShelfNameFetcher = useFetcher();

  const isDeletingShelf =
    deleteShelfFetcher.formData?.get("_action") === "deleteShelf" &&
    deleteShelfFetcher.formData?.get("shelfId") === shelf.id;

  return (
    <li
      key={shelf.id}
      className={classNames(
        "border-2 border-primary rounded-md p-4 h-fit",
        "w-[calc(100vw-2rem)] flex-none snap-center",
        "md:w-96"
      )}
    >
      <saveShelfNameFetcher.Form method="post" className="flex">
        <input
          type="text"
          defaultValue={shelf.name}
          name="shelfName"
          placeholder="Shelf Name"
          autoComplete="off"
          className={classNames(
            "text-2xl font-extrabold mb-2 w-full outline-none",
            "border-b-2 focus:border-b-primary border-b-background"
          )}
        />
        <button name="_action" value="saveShelfName" className="ml-4">
          <SaveIcon />
        </button>
        <input type="hidden" name="shelfId" value={shelf.id} />
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
        <DeleteButton
          className="w-full"
          name="_action"
          value="deleteShelf"
          isLoading={isDeletingShelf}
        >
          {isDeletingShelf ? "Deleting Shelf" : "Delete Shelf"}
        </DeleteButton>
      </deleteShelfFetcher.Form>
    </li>
  );
}
