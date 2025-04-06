import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { profileApi, CreateProfileRequest, Profile } from '@/lib/api/profile'
import { ApiResponse } from '@/lib/api/types'
import { useProfileStore } from '@/store/profile'

export const useProfile = () => {
  const queryClient = useQueryClient()
  const { setProfile } = useProfileStore()

  const queryOptions: UseQueryOptions<ApiResponse<Profile>> = {
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  }

  const { data: profileResponse, isLoading } = useQuery<ApiResponse<Profile>>(queryOptions)

  const mutationOptions: UseMutationOptions<ApiResponse<Profile>, Error, CreateProfileRequest> = {
    mutationFn: profileApi.createProfile,
    onSuccess: (data: ApiResponse<Profile>) => {
      setProfile(data.data)
      queryClient.setQueryData(['profile'], data)
    },
  }

  const createProfileMutation = useMutation<ApiResponse<Profile>, Error, CreateProfileRequest>(mutationOptions)

  return {
    profile: profileResponse?.data,
    isLoading,
    createProfile: createProfileMutation.mutate,
    isCreating: createProfileMutation.isPending,
    createError: createProfileMutation.error,
  }
} 