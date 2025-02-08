"use client";

import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { Team } from "@/types/football";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: {
    itemId: string;
    type: string;
  }[];
  addFavorite: (itemId: string) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await fetch('/api/favorites', {
      });
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      return response.json();
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'team',
          itemId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log(data)
      // @ts-ignore
      queryClient.setQueryData(['favorites'], (old: { itemId: string }[]) => [...old, {
        itemId: data.itemId as string,
        type: 'team',
      }]);
      toast.success(`Added to favorites`);
    },
    onError: (error) => {
      toast.error('Failed to add to favorites');
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'team',
          itemId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }
      return itemId;
    },
    onSuccess: (itemId) => {
      queryClient.setQueryData(['favorites'], (old: { itemId: string }[]) => 
        old.filter((item: { itemId: string }) => item.itemId !== itemId)
      );
      toast.success(`Removed from favorites`);
    },
    onError: (error) => {
      toast.error('Failed to remove from favorites');
    },
  });

  const addFavorite = (itemId: string) => {
    addFavoriteMutation.mutate(itemId);
  };

  const removeFavorite = (itemId: string) => {
    removeFavoriteMutation.mutate(itemId);
  };

  const isFavorite = (itemId: string) => {
    return favorites.some((item: { itemId: string }) => `${item.itemId}` === itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        isFavorite 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
