import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi, Profile } from '@/lib/api/profile'
import { ApiResponse } from '@/lib/api/types'
import { useProfileStore } from '@/store/profile'

export const useProfile = () => {
  const queryClient = useQueryClient()
  const { setProfile } = useProfileStore()

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  })

  const createProfileMutation = useMutation({
    mutationFn: profileApi.createProfile,
    onSuccess: (data: ApiResponse<Profile>) => {
      setProfile(data.data)
      queryClient.setQueryData(['profile'], data)
    },
  })

  return {
    profile: profileResponse?.data,
    isLoading,
    createProfile: createProfileMutation.mutate,
    isCreating: createProfileMutation.isPending,
    createError: createProfileMutation.error,
  }
} 