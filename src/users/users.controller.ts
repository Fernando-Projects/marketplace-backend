import { Controller, Post, Body,Res, HttpStatus, UsePipes, ValidationPipe, UseGuards, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateUserDto } from './dto/updateUser.dto';


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  //Create a new user
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'The user has been successfully created.' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: CreateUserDto })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try{
       const user= await this.usersService.create(createUserDto);
       return res.status(HttpStatus.CREATED).json({ok:true,status:201, message: 'The user has been successfully created.',data:user});
   }catch (error){      
        let item= error.message
        if(error.status==404 && item.includes('Email Exist')) {
           return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:400, message:`The email is already registere`,data:[]});
          }else{
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false,status:500, message:item,data:[]});
          }
   }
  }

  //Get all users
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.', isArray: true })
  @ApiResponse({ status: 400, description: 'Users not found.' })
  @ApiQuery({
    name: 'limit', // Si tu DTO es solo para la paginación
    description: 'Limit',
    schema: { type: 'number', example: 10 },
  })
  @ApiQuery({
    name: 'page', // Si tu DTO es solo para la paginación
    description: 'Page',
    schema: { type: 'number', example: 1 },
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Get()
  async findAllUsers(@Query() query:PaginationDto, @Res() res: Response) {
      try{
        const users= await this.usersService.findAll(query);
        if(users.data.length>0){
          return res.status(HttpStatus.OK).json({ok:true,status:200, message: 'List of all users', data:users});
        }else{
          return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:404, message: 'Users not found.', data:[]});
        }
      }catch(error){
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false,statusCode:500, message:error.message,data:[]});
      }
  }

  //Get a single user by id
  @ApiOperation({ summary: 'Get a single user by id' })
  @ApiResponse({ status: 200, description: 'User Detail',isArray: false})
  @ApiResponse({ status: 400, description: 'User with id # ${id} not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Get(':id')
  async findOneUserById(@Param('id') id: number, @Res() res: Response) {
   
   if (isNaN(Number(id))) {
      return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:400, message: 'Invalid ID. The ID must be a number.', data:[]});
   }
   try{
    const user = await this.usersService.findOne(id);
    return res.status(HttpStatus.OK).json({ok:true,status:200, message: 'User Detail', data:user});
   }catch(error){
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false, status:error.status, message:error.message,data:[]});
   }
  }

    //Get a single user by email
    @ApiOperation({ summary: 'Get a single user by email' })
    @ApiResponse({ status: 200, description: 'User Detail', isArray: false })
    @ApiResponse({ status: 400, description: 'User with email ${email} not found' })
    @ApiParam({ name: 'email', type: 'string', description: 'User email' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Get(':search/:email')
    async findByEmail(@Param('email') email: string, @Res() res: Response) {
     
    try{
       const user = await this.usersService.findOneByEmail(email);
       if(user){
         return res.status(HttpStatus.OK).json({ok:true,status:200, message: 'User Detail', data:user});
        }else{
          return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:400, message: `User with email ${email} not found`, data:[]});
        }
     }catch(error){
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false,status:error.status, message:error.message,data:[]});
     }
    }

  //Update a single user by id
  @ApiOperation({ summary: 'Update a single user by id' })
  @ApiResponse({ status: 200, description: 'User Update successfully', type: UpdateUserDto, isArray: false })
  @ApiResponse({ status: 400, description: 'User not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch(':id')
  async updateUserById(@Param('id') id: number,@Body() updateUser: UpdateUserDto,  @Res() res: Response) {
   
   if (isNaN(Number(id))) {
      return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:400, message: 'Invalid ID. The ID must be a number.', data:[]});
   }

   try{
      const user = await this.usersService.update(id, updateUser);
      if(user){
        return res.status(HttpStatus.OK).json({ok:true,status:200, message: 'User Update successfully', data:user});
        }else{
        return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:400, message: `User id # ${id} not found`, data:[]});
        }
   }catch(error){
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false,status:error.status, message:error.message,data:[]});
   }
  }

    //Delete a single user by id
    @ApiOperation({ summary: 'Delete a single user by id' })
    @ApiResponse({ status: 200, description: 'User delete successfully'})
    @ApiResponse({ status: 400, description: 'User not found' })
    @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Delete(':id')
    async deleteUserById(@Param('id') id: number,  @Res() res: Response) {
     
     if (isNaN(Number(id))) {
        return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:400, message: 'Invalid ID. The ID must be a number.', data:[]});
     }
  
     try{
      const user = await this.usersService.delete(id);
      if(user){
        return res.status(HttpStatus.OK).json({ok:true,status:200, message: 'User delete successfully', data:user});
      }else{
        return res.status(HttpStatus.BAD_REQUEST).json({ok:false,status:400, message: `User id # ${id} not found`, data:[]});
      }
     }catch(error){
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ok:false,status:error.status, message:error.message,data:[]});
     }
    }


}