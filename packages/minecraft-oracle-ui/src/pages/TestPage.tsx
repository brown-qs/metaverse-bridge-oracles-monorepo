import React, { useEffect, useState } from 'react';
import { useClasses, useOauthLogin } from 'hooks';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack } from '@chakra-ui/react';
import { DeviceGamepad2, Pencil, Tags, User } from 'tabler-icons-react';

const TestPage = () => {
  const toast = useToast()

  function capitalize(s: string) {
    // returns the first letter capitalized + the string from index 1 and out aka. the rest of the string
    return s[0].toUpperCase() + s.substr(1);
  }

  const statuses = ['success', 'error', 'warning', 'info']
  const alertVariants = ["subtle", "left-accent", "top-accent", "solid"]
  for (const status of statuses) {
    toast({
      title: `${capitalize(status)}`,
      description: `Description for ${capitalize(status)}`,
      status: status as any,
      isClosable: true,
      duration: 900000,
    })
  }

  useEffect(() => {
    return toast.closeAll
  }, [])

  const alertsAllStatuses = (variant: any) => {
    return (
      <HStack w="100%">
        {statuses.map(status =>
          <Box>
            <Alert status={status as any} variant={variant as any}>
              <AlertIcon />
              <Box>
                <AlertTitle>{capitalize(status)} Title</AlertTitle>
                <AlertDescription>Variant {capitalize(variant)}</AlertDescription>
              </Box>
              <CloseButton
                alignSelf='flex-start'
                position='relative'
                right={-1}
                top={-1}
              />
            </Alert>
          </Box>)}
      </HStack>
    )
  }


  return (<Box bg="black" h="100%" w="100%" color="white">
    <VStack>
      <Box marginTop="16px"><Heading size="md">UI Test Page</Heading></Box>
      <Box paddingTop="32px">
        <VStack>
          <Heading size="sm">Alerts</Heading>
          {alertVariants.map(variant => alertsAllStatuses(variant))}

        </VStack>
      </Box>



    </VStack>
  </Box>)
}
export default TestPage;