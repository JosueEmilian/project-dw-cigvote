CREATE DATABASE CIGVotingDB;

-- Enable extension for UUIDs 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables
CREATE TABLE "User" (
    userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    registrationNumber VARCHAR(50) UNIQUE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    dpi VARCHAR(13) UNIQUE NOT NULL,
    birthDate DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Campaign" (
    campaignId BIGSERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    description TEXT,
    isVotingEnabled BOOLEAN NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Candidate" (
    candidateId UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    fullName VARCHAR(255) NOT NULL,
    campaignId BIGINT NOT NULL,
    description TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campaign FOREIGN KEY (campaignId) REFERENCES "Campaign" (campaignId) ON DELETE CASCADE
);

CREATE TABLE "Vote" (
    voteId BIGSERIAL PRIMARY KEY, 
    userId UUID NOT NULL,
    candidateId UUID NOT NULL,
    campaignId BIGINT NOT NULL,
    voteDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "User" (userId) ON DELETE CASCADE,
    CONSTRAINT fk_candidate FOREIGN KEY (candidateId) REFERENCES "Candidate" (candidateId) ON DELETE CASCADE,
    CONSTRAINT fk_campaign FOREIGN KEY (campaignId) REFERENCES "Campaign" (campaignId) ON DELETE CASCADE,
    CONSTRAINT unique_user_campaign UNIQUE (userId, campaignId) 
);

CREATE TABLE "Role" (
    roleId BIGSERIAL PRIMARY KEY, 
    roleName VARCHAR(100) NOT NULL
);

CREATE TABLE "Permission" (
    permissionId BIGSERIAL PRIMARY KEY, 
    permissionName VARCHAR(100) NOT NULL
);

CREATE TABLE "User_Role" (
    userRoleId BIGSERIAL PRIMARY KEY, 
    roleId BIGINT NOT NULL,
    userId UUID NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (roleId) REFERENCES "Role" (roleId) ON DELETE CASCADE,
    CONSTRAINT fk_user_role FOREIGN KEY (userId) REFERENCES "User" (userId) ON DELETE CASCADE
);

CREATE TABLE "Role_Permission" (
    rolePermissionId BIGSERIAL PRIMARY KEY, 
    permissionId BIGINT NOT NULL,
    roleId BIGINT NOT NULL,
    CONSTRAINT fk_permission FOREIGN KEY (permissionId) REFERENCES "Permission" (permissionId) ON DELETE CASCADE,
    CONSTRAINT fk_role_permission FOREIGN KEY (roleId) REFERENCES "Role" (roleId) ON DELETE CASCADE
);

-- CREATE ROLES
INSERT INTO "Role" (roleName) VALUES ('Admin');
INSERT INTO "Role" (roleName) VALUES ('Voter');

--  Indexes 
CREATE INDEX idx_vote_userId ON "Vote"(userId);
CREATE INDEX idx_vote_candidateId ON "Vote"(candidateId);
CREATE INDEX idx_user_role_userId ON "User_Role"(userId);
CREATE INDEX idx_user_role_roleId ON "User_Role"(roleId);
CREATE INDEX idx_role_permission_roleId ON "Role_Permission"(roleId);
CREATE INDEX idx_role_permission_permissionId ON "Role_Permission"(permissionId);
