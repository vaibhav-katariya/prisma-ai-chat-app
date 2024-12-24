import { prisma } from "../db/db.config.js";
import { ErrorResponse, Responce } from "../utils/apiResponce.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name) {
      return ErrorResponse({ res, message: "Project name is required." });
    }
    if (!req.userId) {
      return ErrorResponse({
        res,
        message: "Only logged-in users can create a project.",
      });
    }

    // Ensure the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!userExists) {
      return ErrorResponse({
        res,
        message: "User not found. Please log in with a valid account.",
      });
    }

    // Check if the project name already exists
    const projectExist = await prisma.project.findFirst({
      where: {
        name,
      },
    });

    if (projectExist) {
      return ErrorResponse({ res, message: "Project already exists." });
    }

    // Create the project and associate the user through the join table
    const project = await prisma.project.create({
      data: {
        name,
        description,
        users: {
          create: {
            user: {
              connect: {
                id: req.userId,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return ErrorResponse({ res, message: "Project not created." });
    }

    Responce({
      res,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Error while creating project:", error);
    ErrorResponse({
      res,
      error: error.message,
      message: "Error while creating project.",
    });
  }
};

export const addUsersToProject = async (req, res) => {
  try {
    const { projectId, userIds } = req.body;

    if (!projectId || !userIds || !Array.isArray(userIds)) {
      return ErrorResponse({
        res,
        message: "projectId and userIds are required",
      });
    }

    // Check if project exists
    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      return ErrorResponse({ res, message: "project not found" });
    }

    // Ensure all users exist
    const usersExist = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    if (usersExist.length !== userIds.length) {
      return ErrorResponse({
        res,
        message: "some users do not exist",
      });
    }

    // Add users to project
    await prisma.userProjects.createMany({
      data: userIds.map((userId) => ({
        userId,
        projectId,
      })),
      skipDuplicates: true, // Avoid duplicate entries
    });

    Responce({ res, message: "users added to project" });
  } catch (error) {
    ErrorResponse({
      res,
      error: error.message,
      message: "error while adding users to project",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            userId: req.userId,
          },
        },
      },
    });

    Responce({ res, message: "projects found", data: projects });
  } catch (error) {
    ErrorResponse({
      res,
      message: "error while getting projects",
      error: error.message,
    });
  }
};