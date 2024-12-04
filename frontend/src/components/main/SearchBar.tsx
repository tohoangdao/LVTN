import Input from "@/components/common/Input";
import SearchIconMD from "@/assets/search-md.svg";
import SearchIconLG from "@/assets/search-lg.svg";


function SearchBar() {
  return (
    <div className="flex gap-4  mb-xl w-full items-center max-sm:p-0 max-sm:flex-col max-sm:justify-center">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <Input
          placeholder="Search"
          prefix={<SearchIconLG />}
        />
      </div>
      <button className="bg-white h-11 flex items-center px-4 rounded-lg border border-solid border-borderPrimary text-white">
        <SearchIconMD />
      </button>
    </div>
  );
}
export default SearchBar;