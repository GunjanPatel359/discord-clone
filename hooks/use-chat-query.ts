"use client";
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
    apiUrl: string
    queryKey: string
    paramKey: "channelId" | "conversationId"
    paramValue: string
}

export const useChatQuery = ({ apiUrl, queryKey, paramKey, paramValue }: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({pageParam = undefined}) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue
            }
        }, { skipNull: true });

        const response = await fetch(url);
        return response.json();
    }

    let {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        initialPageParam: undefined,
        getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000
    })

    console.log("data", data);

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }
}