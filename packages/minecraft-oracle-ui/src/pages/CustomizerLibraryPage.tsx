import React, { ComponentType, memo, RefObject, useEffect, useRef, useState } from 'react';
import { useAccountDialog, useActiveWeb3React, useClasses } from 'hooks';
import { Container, Image, Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, Heading, HStack, Stack, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast, VStack, useMediaQuery, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, FormControl, FormLabel, Skeleton, useDimensions } from '@chakra-ui/react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';
import LibraryCustomizerCard from '../components/Customizer/LibraryCustomizerCard';
import { FixedSizeGrid as _FixedSizeGrid, GridChildComponentProps, areEqual, FixedSizeGridProps } from 'react-window';
import CustomizerLibrary from '../components/Customizer/CustomizerLibrary';

const CustomizerLibraryPage = () => {
  const FixedSizeGrid = _FixedSizeGrid as ComponentType<FixedSizeGridProps>;

  const { account, chainId, library } = useActiveWeb3React()
  const { librarySection } = useParams<{ librarySection?: string }>();
  const navigate = useNavigate()
  const listContainerRef = useRef<any>()
  const dimensions = useDimensions(listContainerRef)
  const libraryPages = ["staked", "wallet", "exosama", "moonsama"]

  if (!libraryPages.includes(librarySection ?? "")) {
    return <Navigate to="/customizer/library/exosama"></Navigate>
  }

  return <CustomizerLibrary librarySection={librarySection ?? "exosama"}></CustomizerLibrary>
}

export default CustomizerLibraryPage