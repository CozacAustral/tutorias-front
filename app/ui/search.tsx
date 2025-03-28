'use client'
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchProps {
    onSearch: (term: string) => void; 
}

const Search: React.FC<SearchProps> = ( {onSearch} ) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);

        onSearch(term)
    }, 300)


    return (
        <InputGroup width="30%" mr={2}>
        <InputLeftElement pointerEvents="none">
        </InputLeftElement>
        <Input
            placeholder="Buscar"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("query")?.toString()}
        />
        </InputGroup>
        );
}

export default Search