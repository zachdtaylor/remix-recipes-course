import classNames from "classnames";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { createShelf, getAllShelves } from "~/models/pantry-shelf.server";
import { Route } from "./+types/pantry";
import { PlusIcon, SearchIcon } from "~/components/icons";
import { PrimaryButton } from "~/components/form";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const shelves = await getAllShelves(q);
  return { shelves };
}

export async function action() {
  return createShelf();
}

export default function Pantry() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const isSearching = navigation.formData?.has("q");

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
      <Form reloadDocument method="post">
        <PrimaryButton className="mt-4 w-full md:w-fit">
          <PlusIcon />
          <span className="pl-2">Create Shelf</span>
        </PrimaryButton>
      </Form>
      <ul
        className={classNames(
          "flex gap-8 overflow-x-auto mt-4 pb-4",
          "snap-x snap-mandatory md:snap-none"
        )}
      >
        {data.shelves.map((shelf) => (
          <li
            key={shelf.id}
            className={classNames(
              "border-2 border-primary rounded-md p-4 h-fit",
              "w-[calc(100vw-2rem)] flex-none snap-center",
              "md:w-96"
            )}
          >
            <h1 className="text-2xl font-extrabold mb-2">{shelf.name}</h1>
            <ul>
              {shelf.items.map((item) => (
                <li key={item.id} className="py-2">
                  {item.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
