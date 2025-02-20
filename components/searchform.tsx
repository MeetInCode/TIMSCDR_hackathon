'use client';

import { useState, FormEvent } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  onSearch: (query: string) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleReset = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Search for mentors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
        Search
      </Button>
      {searchQuery && (
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} className="text-gray-500" />
        </Button>
      )}
    </form>
  );
};

export default SearchForm;

/*The name="query" attribute links this input field to the query parameter in the form submission.
suppose it would be query1 then browser would display 
http://localhost:3000/?query1=

When you type something into the input, this value replaces the existing value or defualt value

What Happens When You Submit
The form data is sent to the URL defined in the action attribute.
In this case, action="/" means the form submits to the same page (the root of the site).
The browser gathers all form inputs with a name attribute and includes their values in the request.
For example, if you type Innovative Idea in the input, the browser sends a GET request like this:
graphql
Copy code
GET /?query=Innovative+Idea

now this innovative idea is intercepted by page.tsx
*/